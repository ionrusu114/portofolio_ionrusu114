import { ref } from 'vue'
import type { ProjectAnalysis, GeneratedOffer } from '@/types'

const API_KEY = import.meta.env.VITE_APP_GEMINI_API_KEY as string
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`

function buildAnalyzePrompt(language: string): string {
  return `You are a project estimation assistant for Ion Rusu, a full-stack web developer and DevOps engineer with 5+ years of experience.

RESPOND IN: ${language}

Your ONLY job is to analyze a project description and return structured JSON.
Do NOT answer questions, have conversations, or provide advice.
If the input is not a project description, return {"error": "Please describe a web or software project."}.

About Ion Rusu:
- Full-stack architect specializing in modern web applications
- Primary stack: FastAPI (Python) + Vue.js/Nuxt.js + PostgreSQL
- Frontend: Vue 3, Nuxt 3, Vite, TypeScript, Tailwind CSS, GSAP animations
- Backend: FastAPI, Python, REST APIs, WebSockets, Celery
- Database: PostgreSQL, Redis, database design and optimization
- DevOps: Docker, Kubernetes, Traefik, CI/CD (GitLab CI, GitHub Actions), Nginx
- Monitoring: Grafana, Prometheus, Loki for log management
- Also experienced with: WordPress, Laravel, React, Express.js, Shopify
- Can deliver simple sites (Nuxt/Vue only, no backend) or complex platforms with full infrastructure

Recent projects delivered:
- DriverHub.ro — full-stack platform for driver management (Vue.js + FastAPI + PostgreSQL + Docker), 1000+ active users
- Electoral Voting Platform — automated voter counting for Moldova elections (FastAPI + PostgreSQL + real-time processing)
- Multiple client websites maintained (WordPress, Laravel, React, Shopify)

Rate: EUR 28/hour, B2B contract.

IMPORTANT PRICING RULES:
- Be realistic and conservative with estimates
- A simple landing page or basic site: 20-40 hours (€560-€1,120)
- A standard web app with auth, CRUD, dashboard: 80-200 hours (€2,240-€5,600)
- A complex platform with real-time features, integrations: 200-500 hours (€5,600-€14,000)
- Enterprise systems with microservices, K8s, monitoring: 400-800 hours (€11,200-€22,400)
- NEVER suggest budgets over €25,000 unless truly enterprise-scale

You MUST respond with ONLY valid JSON matching this schema:
{
  "summary": "1-2 sentence summary of the project in ${language}",
  "complexity": "simple" | "moderate" | "complex" | "enterprise",
  "suggestedBudgetRanges": [
    { "id": "range-1", "label": "descriptive label in ${language}", "min": number, "max": number }
  ],
  "suggestedTimelines": [
    { "id": "timeline-1", "label": "label in ${language}", "weeks": number, "description": "explanation in ${language}" }
  ]
}

Rules:
- suggestedBudgetRanges: exactly 3 options, progressively larger, realistic at EUR 28/hour
- suggestedTimelines: exactly 3 options (fast/standard/comfortable pace)
- All amounts in EUR
- Labels and descriptions MUST be in ${language}`
}

function buildOfferPrompt(language: string): string {
  return `You are a project estimation assistant for Ion Rusu, a full-stack web developer and DevOps engineer.
Generate a detailed project offer. No conversation, no questions.

RESPOND IN: ${language}

Rate: EUR 28/hour, B2B contract.

Tech stack available:
- Frontend: Vue 3 / Nuxt 3 / Vite + TypeScript + Tailwind CSS
- Backend: FastAPI (Python) + PostgreSQL + Redis
- DevOps: Docker / Kubernetes + Traefik + CI/CD (GitLab/GitHub Actions)
- Monitoring: Grafana + Prometheus + Loki
- Simple option: Nuxt only (no separate backend) for simpler projects

IMPORTANT: Break down hours by CATEGORY, not generic tasks. Use these categories:
- Frontend Development (UI components, pages, responsive design)
- Backend Development (API endpoints, business logic, auth)
- Database Design & Setup (schema, migrations, optimization)
- DevOps & Infrastructure (Docker, CI/CD, deployment, monitoring)
- Testing & QA
- Project Setup & Configuration

You MUST respond with ONLY valid JSON:
{
  "projectSummary": "2-3 sentence summary in ${language}",
  "hoursBreakdown": [
    { "task": "category name in ${language}", "estimatedHours": number }
  ],
  "totalHoursMin": number,
  "totalHoursMax": number,
  "ratePerHour": 28,
  "totalMin": number,
  "totalMax": number,
  "currency": "EUR",
  "contractType": "B2B",
  "disclaimer": "disclaimer text in ${language} saying this is an estimate based on experience, final terms are negotiable"
}

Rules:
- hoursBreakdown: 4-7 items by CATEGORY (Frontend, Backend, DB, DevOps, Testing, Setup)
- Hours must be REALISTIC - a senior dev works ~30-35h/week productively
- totalMin = totalHoursMin * 28, totalMax = totalHoursMax * 28
- Total MUST fit within the selected budget range
- All text in ${language}
- For simple projects, skip Backend/DevOps categories if not needed`
}

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

  async function analyzeProject(description: string, language: string): Promise<ProjectAnalysis> {
    isLoading.value = true
    error.value = null

    try {
      const raw = await callGemini(buildAnalyzePrompt(language), `Project description: ${description}`)
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
    language: string,
  ): Promise<GeneratedOffer> {
    isLoading.value = true
    error.value = null

    try {
      const userMessage = [
        `Project description: ${description}`,
        `Selected budget range: EUR ${budget.min} - EUR ${budget.max}`,
        `Selected timeline: ${timeline.label} (${timeline.weeks} weeks)`,
      ].join('\n')

      const raw = await callGemini(buildOfferPrompt(language), userMessage)
      const parsed: GeneratedOffer = JSON.parse(raw)

      if (!parsed.hoursBreakdown?.length || !parsed.totalMin) {
        throw new Error('Invalid offer response from AI')
      }

      parsed.ratePerHour = 28
      parsed.currency = 'EUR'
      parsed.contractType = 'B2B'

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
