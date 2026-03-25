import { ref } from 'vue'
import type { ProjectAnalysis, GeneratedOffer } from '@/types'

const API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY as string
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

const ANALYZE_SYSTEM_PROMPT = `You are a project estimation assistant for Ion Rusu, a full-stack web developer with 5+ years of experience.
Your ONLY job is to analyze a project description and return structured JSON.
Do NOT answer questions, have conversations, or provide advice.
If the input is not a project description, return {"error": "Please describe a web or software project you'd like built."}.

Rate: EUR 28/hour, B2B contract.

You MUST respond with ONLY valid JSON matching this exact schema:
{
  "summary": "1-2 sentence summary of the project",
  "complexity": "simple" | "moderate" | "complex" | "enterprise",
  "suggestedBudgetRanges": [
    { "id": "range-1", "label": "descriptive label", "min": number, "max": number }
  ],
  "suggestedTimelines": [
    { "id": "timeline-1", "label": "descriptive label", "weeks": number, "description": "brief explanation" }
  ]
}

Rules:
- suggestedBudgetRanges: exactly 3-4 options, progressively larger, realistic for the described project at EUR 28/hour
- suggestedTimelines: exactly 3 options labeled as aggressive, standard, and comfortable pace
- All amounts in EUR
- Budget ranges should reflect actual development effort needed`

const OFFER_SYSTEM_PROMPT = `You are a project estimation assistant for Ion Rusu, a full-stack web developer.
Generate a detailed project offer based on the provided inputs. No conversation, no questions.

Rate: EUR 28/hour, B2B contract.

You MUST respond with ONLY valid JSON matching this exact schema:
{
  "projectSummary": "2-3 sentence project summary",
  "hoursBreakdown": [
    { "task": "task name", "estimatedHours": number }
  ],
  "totalHoursMin": number,
  "totalHoursMax": number,
  "ratePerHour": 28,
  "totalMin": number,
  "totalMax": number,
  "currency": "EUR",
  "contractType": "B2B",
  "disclaimer": "This is an estimate based on my experience working with clients on similar projects. Final terms are negotiable."
}

Rules:
- hoursBreakdown: 4-8 line items covering all major work areas
- Hours must realistically sum to the totalHoursMin-totalHoursMax range
- totalMin = totalHoursMin * 28, totalMax = totalHoursMax * 28
- The total must fit within the selected budget range
- The timeline must be achievable with the estimated hours at reasonable weekly capacity (30-40h/week)`

async function callGemini(systemPrompt: string, userMessage: string): Promise<string> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: userMessage }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text

  if (!text) {
    throw new Error('Empty response from Gemini API')
  }

  return text
}

export function useGeminiApi() {
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function analyzeProject(description: string): Promise<ProjectAnalysis> {
    isLoading.value = true
    error.value = null

    try {
      const raw = await callGemini(ANALYZE_SYSTEM_PROMPT, `Project description: ${description}`)
      const parsed: ProjectAnalysis = JSON.parse(raw)

      if (parsed.error) {
        throw new Error(parsed.error)
      }

      if (!parsed.suggestedBudgetRanges?.length || !parsed.suggestedTimelines?.length) {
        throw new Error('Invalid response structure from AI')
      }

      return parsed
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to analyze project'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function generateOffer(
    description: string,
    budget: { min: number; max: number },
    timeline: { weeks: number; label: string },
  ): Promise<GeneratedOffer> {
    isLoading.value = true
    error.value = null

    try {
      const userMessage = [
        `Project description: ${description}`,
        `Selected budget range: EUR ${budget.min} - EUR ${budget.max}`,
        `Selected timeline: ${timeline.label} (${timeline.weeks} weeks)`,
      ].join('\n')

      const raw = await callGemini(OFFER_SYSTEM_PROMPT, userMessage)
      const parsed: GeneratedOffer = JSON.parse(raw)

      if (!parsed.hoursBreakdown?.length || !parsed.totalMin) {
        throw new Error('Invalid offer response from AI')
      }

      // Enforce fixed values
      parsed.ratePerHour = 28
      parsed.currency = 'EUR'
      parsed.contractType = 'B2B'
      parsed.disclaimer = 'This is an estimate based on my experience working with clients on similar projects. Final terms are negotiable.'

      return parsed
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate offer'
      error.value = message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, analyzeProject, generateOffer }
}
