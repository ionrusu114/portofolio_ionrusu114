import { ref, computed } from 'vue'
import type { OfferFlowStep, OfferChatMessage, ChatAction, GeneratedOffer, ProjectAnalysis } from '@/types'
import { useGeminiApi } from '@/composables/useGeminiApi'
import { sendOfferEmail } from '@/services/emailWebhook'

const STORAGE_KEY = 'portfolio_offer_sessions'
const MAX_SESSIONS = 3

function getSessionCount(): number {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? parseInt(stored, 10) : 0
}

function incrementSessionCount(): void {
  localStorage.setItem(STORAGE_KEY, String(getSessionCount() + 1))
}

function createMessage(
  role: 'user' | 'assistant' | 'system',
  content: string,
  extra?: Partial<OfferChatMessage>,
): OfferChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    timestamp: Date.now(),
    ...extra,
  }
}

export function useOfferChat() {
  const messages = ref<OfferChatMessage[]>([])
  const currentStep = ref<OfferFlowStep>('greeting')
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const isRateLimited = ref(false)

  // Accumulated session data
  const projectDescription = ref('')
  const selectedBudget = ref<{ min: number; max: number; label: string } | null>(null)
  const selectedTimeline = ref<{ weeks: number; label: string } | null>(null)
  const currentAnalysis = ref<ProjectAnalysis | null>(null)
  const currentOffer = ref<GeneratedOffer | null>(null)

  const { analyzeProject, generateOffer } = useGeminiApi()

  const canSendMessage = computed(() => currentStep.value === 'awaiting-description')

  function initialize(): void {
    if (getSessionCount() >= MAX_SESSIONS) {
      isRateLimited.value = true
      currentStep.value = 'rate-limited'
      return
    }

    messages.value = [
      createMessage(
        'assistant',
        'Hi! I\'m here to help you get a project estimate. Could you describe the web or software project you have in mind? The more details you provide, the more accurate the estimate will be.',
      ),
    ]
    currentStep.value = 'awaiting-description'
  }

  async function sendMessage(content: string): Promise<void> {
    if (currentStep.value !== 'awaiting-description') return
    if (content.trim().length < 20) {
      messages.value.push(
        createMessage('assistant', 'Could you provide a bit more detail? Please describe your project in at least a few sentences so I can give you an accurate estimate.'),
      )
      return
    }

    projectDescription.value = content.trim()
    messages.value.push(createMessage('user', content))

    // Show loading
    currentStep.value = 'analyzing'
    isLoading.value = true
    error.value = null

    try {
      const analysis = await analyzeProject(projectDescription.value)
      currentAnalysis.value = analysis

      // Build budget action buttons from AI analysis
      const budgetActions: ChatAction[] = analysis.suggestedBudgetRanges.map((range) => ({
        id: range.id,
        label: `${range.label}`,
        value: JSON.stringify({ min: range.min, max: range.max }),
        description: `€${range.min.toLocaleString()} - €${range.max.toLocaleString()}`,
      }))

      // Add custom option
      budgetActions.push({
        id: 'custom',
        label: 'Set Custom Range',
        value: 'custom',
        description: 'Enter your own budget range',
      })

      messages.value.push(
        createMessage('assistant', `Great! Here\'s what I understand: ${analysis.summary}\n\nBased on the complexity of your project, here are some budget ranges to consider:`, {
          actionType: 'budget-select',
          actions: budgetActions,
        }),
      )

      currentStep.value = 'awaiting-budget'
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      error.value = msg

      if (msg.includes('describe a web') || msg.includes('project description')) {
        messages.value.push(
          createMessage('assistant', 'I can only help with project estimates for web and software development. Could you describe a specific project you\'d like built?'),
        )
        currentStep.value = 'awaiting-description'
      } else {
        messages.value.push(
          createMessage('assistant', 'Something went wrong while analyzing your project. Please try again.'),
        )
        currentStep.value = 'awaiting-description'
      }
    } finally {
      isLoading.value = false
    }
  }

  function selectBudget(actionId: string): void {
    if (currentStep.value !== 'awaiting-budget') return

    // Disable all budget actions and mark selected
    const lastActionMsg = [...messages.value].reverse().find((m) => m.actionType === 'budget-select')
    if (lastActionMsg?.actions) {
      lastActionMsg.actions = lastActionMsg.actions.map((a) => ({
        ...a,
        disabled: true,
        selected: a.id === actionId,
      }))
    }

    if (actionId === 'custom') {
      currentStep.value = 'custom-budget'
      messages.value.push(
        createMessage('assistant', 'Please enter your preferred budget range:', {
          actionType: 'custom-budget',
        }),
      )
      return
    }

    const action = lastActionMsg?.actions?.find((a) => a.id === actionId)
    if (!action) return

    const parsed = JSON.parse(action.value)
    selectedBudget.value = { min: parsed.min, max: parsed.max, label: action.label }

    messages.value.push(
      createMessage('user', `Budget: ${action.description}`),
    )

    proceedToTimeline()
  }

  function submitCustomBudget(min: number, max: number): void {
    if (currentStep.value !== 'custom-budget') return
    if (min <= 0 || max <= 0 || min >= max) return

    selectedBudget.value = { min, max, label: `Custom: €${min.toLocaleString()} - €${max.toLocaleString()}` }

    messages.value.push(
      createMessage('user', `Budget: €${min.toLocaleString()} - €${max.toLocaleString()}`),
    )

    proceedToTimeline()
  }

  function proceedToTimeline(): void {
    if (!currentAnalysis.value) return

    const timelineActions: ChatAction[] = currentAnalysis.value.suggestedTimelines.map((t) => ({
      id: t.id,
      label: t.label,
      value: JSON.stringify({ weeks: t.weeks, label: t.label }),
      description: `${t.weeks} weeks — ${t.description}`,
    }))

    messages.value.push(
      createMessage('assistant', 'Now, what timeline works best for you?', {
        actionType: 'timeline-select',
        actions: timelineActions,
      }),
    )

    currentStep.value = 'awaiting-timeline'
  }

  async function selectTimeline(actionId: string): Promise<void> {
    if (currentStep.value !== 'awaiting-timeline') return
    if (!selectedBudget.value) return

    // Disable all timeline actions and mark selected
    const lastActionMsg = [...messages.value].reverse().find((m) => m.actionType === 'timeline-select')
    if (lastActionMsg?.actions) {
      lastActionMsg.actions = lastActionMsg.actions.map((a) => ({
        ...a,
        disabled: true,
        selected: a.id === actionId,
      }))
    }

    const action = lastActionMsg?.actions?.find((a) => a.id === actionId)
    if (!action) return

    const parsed = JSON.parse(action.value)
    selectedTimeline.value = { weeks: parsed.weeks, label: parsed.label }

    messages.value.push(
      createMessage('user', `Timeline: ${action.description}`),
    )

    // Generate offer
    currentStep.value = 'generating-offer'
    isLoading.value = true
    error.value = null

    try {
      const offer = await generateOffer(
        projectDescription.value,
        { min: selectedBudget.value.min, max: selectedBudget.value.max },
        { weeks: selectedTimeline.value.weeks, label: selectedTimeline.value.label },
      )
      currentOffer.value = offer

      messages.value.push(
        createMessage('assistant', 'Here\'s your project estimate:', { offer }),
      )

      // Add confirm/decline buttons
      messages.value.push(
        createMessage('assistant', 'Would you like to proceed with this estimate?', {
          actionType: 'offer-confirm',
          actions: [
            { id: 'accept', label: 'I like it!', value: 'accept' },
            { id: 'decline', label: 'Not for me', value: 'decline' },
          ],
        }),
      )

      currentStep.value = 'offer-presented'
    } catch {
      messages.value.push(
        createMessage('assistant', 'I had trouble generating your offer. Please try describing your project again.'),
      )
      currentStep.value = 'awaiting-description'
    } finally {
      isLoading.value = false
    }
  }

  async function handleOfferResponse(actionId: string): Promise<void> {
    if (currentStep.value !== 'offer-presented') return

    // Disable confirm buttons
    const lastActionMsg = [...messages.value].reverse().find((m) => m.actionType === 'offer-confirm')
    if (lastActionMsg?.actions) {
      lastActionMsg.actions = lastActionMsg.actions.map((a) => ({
        ...a,
        disabled: true,
        selected: a.id === actionId,
      }))
    }

    if (actionId === 'accept') {
      await acceptOffer()
    } else {
      declineOffer()
    }
  }

  async function acceptOffer(): Promise<void> {
    if (!currentOffer.value || !selectedBudget.value || !selectedTimeline.value) return

    currentStep.value = 'sending-email'
    isLoading.value = true

    messages.value.push(
      createMessage('user', 'I like it!'),
    )

    try {
      await sendOfferEmail({
        projectDescription: projectDescription.value,
        selectedBudget: selectedBudget.value.label,
        selectedTimeline: `${selectedTimeline.value.label} (${selectedTimeline.value.weeks} weeks)`,
        generatedOffer: currentOffer.value,
        timestamp: Date.now(),
      })

      incrementSessionCount()

      messages.value.push(
        createMessage('assistant', 'Excellent! Your offer request has been sent to Ion. He\'ll review it and get back to you soon. Thank you for your interest! 🎉'),
      )

      currentStep.value = 'completed'
    } catch {
      messages.value.push(
        createMessage('assistant', 'I couldn\'t send the offer right now. You can reach Ion directly at ionrusu114@gmail.com to discuss your project.'),
      )
      currentStep.value = 'completed'
      incrementSessionCount()
    } finally {
      isLoading.value = false
    }
  }

  function declineOffer(): void {
    incrementSessionCount()

    messages.value.push(
      createMessage('user', 'Not for me'),
    )
    messages.value.push(
      createMessage('assistant', 'No problem at all! If you change your mind or have a different project in mind, feel free to come back. You can also reach Ion directly at ionrusu114@gmail.com. Have a great day!'),
    )

    currentStep.value = 'declined'
  }

  return {
    messages,
    currentStep,
    isLoading,
    error,
    isRateLimited,
    canSendMessage,
    initialize,
    sendMessage,
    selectBudget,
    submitCustomBudget,
    selectTimeline,
    handleOfferResponse,
  }
}
