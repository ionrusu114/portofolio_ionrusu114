import { ref, computed } from 'vue'
import type { OfferFlowStep, OfferChatMessage, ChatAction, GeneratedOffer, ProjectAnalysis, ClientContact } from '@/types'
import { useGeminiApi } from '@/composables/useGeminiApi'
import { sendOfferEmail } from '@/services/emailWebhook'

const STORAGE_KEY = 'portfolio_offer_sessions'
const MAX_SESSIONS = 3

const LANGUAGES = [
  { id: 'en', label: 'English', flag: '\u{1F1EC}\u{1F1E7}' },
  { id: 'ro', label: 'Rom\u00E2n\u0103', flag: '\u{1F1F7}\u{1F1F4}' },
  { id: 'ru', label: '\u0420\u0443\u0441\u0441\u043A\u0438\u0439', flag: '\u{1F1F7}\u{1F1FA}' },
  { id: 'fr', label: 'Fran\u00E7ais', flag: '\u{1F1EB}\u{1F1F7}' },
  { id: 'de', label: 'Deutsch', flag: '\u{1F1E9}\u{1F1EA}' },
  { id: 'es', label: 'Espa\u00F1ol', flag: '\u{1F1EA}\u{1F1F8}' },
  { id: 'it', label: 'Italiano', flag: '\u{1F1EE}\u{1F1F9}' },
  { id: 'pt', label: 'Portugu\u00EAs', flag: '\u{1F1F5}\u{1F1F9}' },
]

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

  const projectDescription = ref('')
  const selectedBudget = ref<{ min: number; max: number; label: string } | null>(null)
  const selectedTimeline = ref<{ weeks: number; label: string } | null>(null)
  const currentAnalysis = ref<ProjectAnalysis | null>(null)
  const currentOffer = ref<GeneratedOffer | null>(null)
  const selectedLanguage = ref('en')
  const clientContact = ref<ClientContact | null>(null)

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
        'Hi! Welcome to Ion Rusu\'s project estimator. First, please select your preferred language:',
        {
          actionType: 'language-select',
          actions: LANGUAGES.map((lang) => ({
            id: lang.id,
            label: `${lang.flag} ${lang.label}`,
            value: lang.id,
          })),
        },
      ),
    ]
    currentStep.value = 'awaiting-language'
  }

  function selectLanguage(langId: string): void {
    if (currentStep.value !== 'awaiting-language') return

    const lang = LANGUAGES.find((l) => l.id === langId)
    if (!lang) return

    selectedLanguage.value = langId

    const lastActionMsg = [...messages.value].reverse().find((m) => m.actionType === 'language-select')
    if (lastActionMsg?.actions) {
      lastActionMsg.actions = lastActionMsg.actions.map((a) => ({
        ...a,
        disabled: true,
        selected: a.id === langId,
      }))
    }

    messages.value.push(createMessage('user', `${lang.flag} ${lang.label}`))

    const greetings: Record<string, string> = {
      en: 'Great! Please describe the web or software project you have in mind. The more details you provide, the more accurate the estimate will be.',
      ro: 'Excelent! V\u0103 rog s\u0103 descrie\u021Bi proiectul web sau software pe care \u00EEl ave\u021Bi \u00EEn minte. Cu c\u00E2t oferi\u021Bi mai multe detalii, cu at\u00E2t estimarea va fi mai precis\u0103.',
      ru: '\u041E\u0442\u043B\u0438\u0447\u043D\u043E! \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043E\u043F\u0438\u0448\u0438\u0442\u0435 \u0432\u0435\u0431- \u0438\u043B\u0438 \u043F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u043D\u044B\u0439 \u043F\u0440\u043E\u0435\u043A\u0442, \u043A\u043E\u0442\u043E\u0440\u044B\u0439 \u0432\u044B \u0438\u043C\u0435\u0435\u0442\u0435 \u0432 \u0432\u0438\u0434\u0443. \u0427\u0435\u043C \u0431\u043E\u043B\u044C\u0448\u0435 \u0434\u0435\u0442\u0430\u043B\u0435\u0439 \u0432\u044B \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u0435, \u0442\u0435\u043C \u0442\u043E\u0447\u043D\u0435\u0435 \u0431\u0443\u0434\u0435\u0442 \u043E\u0446\u0435\u043D\u043A\u0430.',
      fr: 'Parfait ! Veuillez d\u00E9crire le projet web ou logiciel que vous avez en t\u00EAte. Plus vous fournirez de d\u00E9tails, plus l\'estimation sera pr\u00E9cise.',
      de: 'Gro\u00DFartig! Bitte beschreiben Sie das Web- oder Softwareprojekt, das Sie im Sinn haben. Je mehr Details Sie angeben, desto genauer wird die Sch\u00E4tzung.',
      es: '\u00A1Genial! Por favor, describe el proyecto web o de software que tienes en mente. Cuantos m\u00E1s detalles proporciones, m\u00E1s precisa ser\u00E1 la estimaci\u00F3n.',
      it: 'Ottimo! Per favore, descrivi il progetto web o software che hai in mente. Pi\u00F9 dettagli fornisci, pi\u00F9 accurata sar\u00E0 la stima.',
      pt: '\u00D3timo! Por favor, descreva o projeto web ou de software que tem em mente. Quanto mais detalhes fornecer, mais precisa ser\u00E1 a estimativa.',
    }

    messages.value.push(
      createMessage('assistant', greetings[langId] || greetings.en),
    )
    currentStep.value = 'awaiting-description'
  }

  async function sendMessage(content: string): Promise<void> {
    if (currentStep.value !== 'awaiting-description') return
    if (content.trim().length < 20) {
      const shortMsgs: Record<string, string> = {
        en: 'Could you provide a bit more detail? Please describe your project in at least a few sentences.',
        ro: 'Pute\u021Bi oferi mai multe detalii? V\u0103 rog descrie\u021Bi proiectul \u00EEn c\u00E2teva propozi\u021Bii.',
        ru: '\u041D\u0435 \u043C\u043E\u0433\u043B\u0438 \u0431\u044B \u0432\u044B \u043F\u0440\u0435\u0434\u043E\u0441\u0442\u0430\u0432\u0438\u0442\u044C \u0431\u043E\u043B\u044C\u0448\u0435 \u0434\u0435\u0442\u0430\u043B\u0435\u0439? \u041F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u043E\u043F\u0438\u0448\u0438\u0442\u0435 \u043F\u0440\u043E\u0435\u043A\u0442 \u0432 \u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u0438\u0445 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F\u0445.',
      }
      messages.value.push(
        createMessage('assistant', shortMsgs[selectedLanguage.value] || shortMsgs.en),
      )
      return
    }

    projectDescription.value = content.trim()
    messages.value.push(createMessage('user', content))

    currentStep.value = 'analyzing'
    isLoading.value = true
    error.value = null

    try {
      const analysis = await analyzeProject(projectDescription.value, selectedLanguage.value)
      currentAnalysis.value = analysis

      const budgetActions: ChatAction[] = analysis.suggestedBudgetRanges.map((range) => ({
        id: range.id,
        label: range.label,
        value: JSON.stringify({ min: range.min, max: range.max }),
        description: `\u20AC${range.min.toLocaleString()} - \u20AC${range.max.toLocaleString()}`,
      }))

      budgetActions.push({
        id: 'custom',
        label: selectedLanguage.value === 'ro' ? 'Interval personalizat' : selectedLanguage.value === 'ru' ? '\u0421\u0432\u043E\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D' : 'Set Custom Range',
        value: 'custom',
        description: selectedLanguage.value === 'ro' ? 'Introduce\u021Bi propriul interval' : selectedLanguage.value === 'ru' ? '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0441\u0432\u043E\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D' : 'Enter your own budget range',
      })

      const budgetIntros: Record<string, string> = {
        en: `Here's my analysis: ${analysis.summary}\n\nBased on the project complexity, here are some budget ranges:`,
        ro: `Iat\u0103 analiza mea: ${analysis.summary}\n\nPe baza complexit\u0103\u021Bii proiectului, iat\u0103 c\u00E2teva intervale de buget:`,
        ru: `\u0412\u043E\u0442 \u043C\u043E\u0439 \u0430\u043D\u0430\u043B\u0438\u0437: ${analysis.summary}\n\n\u041D\u0430 \u043E\u0441\u043D\u043E\u0432\u0435 \u0441\u043B\u043E\u0436\u043D\u043E\u0441\u0442\u0438 \u043F\u0440\u043E\u0435\u043A\u0442\u0430, \u0432\u043E\u0442 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D\u044B \u0431\u044E\u0434\u0436\u0435\u0442\u0430:`,
      }

      messages.value.push(
        createMessage('assistant', budgetIntros[selectedLanguage.value] || budgetIntros.en, {
          actionType: 'budget-select',
          actions: budgetActions,
        }),
      )

      currentStep.value = 'awaiting-budget'
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong'
      error.value = msg
      messages.value.push(
        createMessage('assistant', selectedLanguage.value === 'ro'
          ? 'A ap\u0103rut o eroare la analizarea proiectului. V\u0103 rog \u00EEncerca\u021Bi din nou.'
          : 'Something went wrong while analyzing your project. Please try again.'),
      )
      currentStep.value = 'awaiting-description'
    } finally {
      isLoading.value = false
    }
  }

  function selectBudget(actionId: string): void {
    if (currentStep.value !== 'awaiting-budget') return

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
        createMessage('assistant',
          selectedLanguage.value === 'ro' ? 'Introduce\u021Bi intervalul de buget preferat:' :
          selectedLanguage.value === 'ru' ? '\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043F\u0440\u0435\u0434\u043F\u043E\u0447\u0442\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0439 \u0434\u0438\u0430\u043F\u0430\u0437\u043E\u043D \u0431\u044E\u0434\u0436\u0435\u0442\u0430:' :
          'Please enter your preferred budget range:', {
          actionType: 'custom-budget',
        }),
      )
      return
    }

    const action = lastActionMsg?.actions?.find((a) => a.id === actionId)
    if (!action) return

    const parsed = JSON.parse(action.value)
    selectedBudget.value = { min: parsed.min, max: parsed.max, label: action.label }

    messages.value.push(createMessage('user', `Budget: ${action.description}`))
    proceedToTimeline()
  }

  function submitCustomBudget(min: number, max: number): void {
    if (currentStep.value !== 'custom-budget') return
    if (min <= 0 || max <= 0 || min >= max) return

    selectedBudget.value = { min, max, label: `Custom: \u20AC${min.toLocaleString()} - \u20AC${max.toLocaleString()}` }
    messages.value.push(createMessage('user', `Budget: \u20AC${min.toLocaleString()} - \u20AC${max.toLocaleString()}`))
    proceedToTimeline()
  }

  function proceedToTimeline(): void {
    if (!currentAnalysis.value) return

    const timelineActions: ChatAction[] = currentAnalysis.value.suggestedTimelines.map((t) => ({
      id: t.id,
      label: t.label,
      value: JSON.stringify({ weeks: t.weeks, label: t.label }),
      description: `${t.weeks} ${selectedLanguage.value === 'ro' ? 's\u0103pt\u0103m\u00E2ni' : selectedLanguage.value === 'ru' ? '\u043D\u0435\u0434\u0435\u043B\u044C' : 'weeks'} \u2014 ${t.description}`,
    }))

    const timelineIntros: Record<string, string> = {
      en: 'What timeline works best for you?',
      ro: 'Ce perioad\u0103 de timp vi se potrive\u0219te?',
      ru: '\u041A\u0430\u043A\u0438\u0435 \u0441\u0440\u043E\u043A\u0438 \u0432\u0430\u043C \u043F\u043E\u0434\u0445\u043E\u0434\u044F\u0442?',
    }

    messages.value.push(
      createMessage('assistant', timelineIntros[selectedLanguage.value] || timelineIntros.en, {
        actionType: 'timeline-select',
        actions: timelineActions,
      }),
    )

    currentStep.value = 'awaiting-timeline'
  }

  async function selectTimeline(actionId: string): Promise<void> {
    if (currentStep.value !== 'awaiting-timeline') return
    if (!selectedBudget.value) return

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

    messages.value.push(createMessage('user', `Timeline: ${action.description}`))

    currentStep.value = 'generating-offer'
    isLoading.value = true
    error.value = null

    try {
      const offer = await generateOffer(
        projectDescription.value,
        { min: selectedBudget.value.min, max: selectedBudget.value.max },
        { weeks: selectedTimeline.value.weeks, label: selectedTimeline.value.label },
        selectedLanguage.value,
      )
      currentOffer.value = offer

      messages.value.push(
        createMessage('assistant',
          selectedLanguage.value === 'ro' ? 'Iat\u0103 estimarea proiectului dumneavoastr\u0103:' :
          selectedLanguage.value === 'ru' ? '\u0412\u043E\u0442 \u043E\u0446\u0435\u043D\u043A\u0430 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430:' :
          'Here\'s your project estimate:', { offer }),
      )

      const confirmLabels: Record<string, { accept: string; decline: string }> = {
        en: { accept: 'I like it!', decline: 'Not for me' },
        ro: { accept: '\u00CEmi place!', decline: 'Nu m\u0103 intereseaz\u0103' },
        ru: { accept: '\u041C\u043D\u0435 \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F!', decline: '\u041D\u0435 \u0434\u043B\u044F \u043C\u0435\u043D\u044F' },
      }
      const labels = confirmLabels[selectedLanguage.value] || confirmLabels.en

      const confirmIntros: Record<string, string> = {
        en: 'Would you like to proceed with this estimate?',
        ro: 'Dori\u021Bi s\u0103 continua\u021Bi cu aceast\u0103 estimare?',
        ru: '\u0425\u043E\u0442\u0438\u0442\u0435 \u043F\u0440\u043E\u0434\u043E\u043B\u0436\u0438\u0442\u044C \u0441 \u044D\u0442\u043E\u0439 \u043E\u0446\u0435\u043D\u043A\u043E\u0439?',
      }

      messages.value.push(
        createMessage('assistant', confirmIntros[selectedLanguage.value] || confirmIntros.en, {
          actionType: 'offer-confirm',
          actions: [
            { id: 'accept', label: labels.accept, value: 'accept' },
            { id: 'decline', label: labels.decline, value: 'decline' },
          ],
        }),
      )

      currentStep.value = 'offer-presented'
    } catch {
      messages.value.push(
        createMessage('assistant',
          selectedLanguage.value === 'ro' ? 'Am \u00EEnt\u00E2mpinat o eroare. V\u0103 rog \u00EEncerca\u021Bi din nou.' :
          'I had trouble generating your offer. Please try describing your project again.'),
      )
      currentStep.value = 'awaiting-description'
    } finally {
      isLoading.value = false
    }
  }

  async function handleOfferResponse(actionId: string): Promise<void> {
    if (currentStep.value !== 'offer-presented') return

    const lastActionMsg = [...messages.value].reverse().find((m) => m.actionType === 'offer-confirm')
    if (lastActionMsg?.actions) {
      lastActionMsg.actions = lastActionMsg.actions.map((a) => ({
        ...a,
        disabled: true,
        selected: a.id === actionId,
      }))
    }

    if (actionId === 'accept') {
      const confirmLabels: Record<string, string> = {
        en: 'I like it!',
        ro: '\u00CEmi place!',
        ru: '\u041C\u043D\u0435 \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F!',
      }
      messages.value.push(createMessage('user', confirmLabels[selectedLanguage.value] || confirmLabels.en))

      const contactMsgs: Record<string, string> = {
        en: 'Great choice! To send you the offer details, please provide your contact information:',
        ro: 'Alegere excelent\u0103! Pentru a v\u0103 trimite detaliile ofertei, v\u0103 rog introduce\u021Bi datele de contact:',
        ru: '\u041E\u0442\u043B\u0438\u0447\u043D\u044B\u0439 \u0432\u044B\u0431\u043E\u0440! \u0427\u0442\u043E\u0431\u044B \u043E\u0442\u043F\u0440\u0430\u0432\u0438\u0442\u044C \u0432\u0430\u043C \u0434\u0435\u0442\u0430\u043B\u0438 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u044F, \u043F\u043E\u0436\u0430\u043B\u0443\u0439\u0441\u0442\u0430, \u0443\u043A\u0430\u0436\u0438\u0442\u0435 \u043A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435:',
      }

      messages.value.push(
        createMessage('assistant', contactMsgs[selectedLanguage.value] || contactMsgs.en, {
          actionType: 'contact-form',
        }),
      )

      currentStep.value = 'awaiting-contact'
    } else {
      declineOffer()
    }
  }

  async function submitContact(contact: ClientContact): Promise<void> {
    if (currentStep.value !== 'awaiting-contact') return
    if (!currentOffer.value || !selectedBudget.value || !selectedTimeline.value) return

    clientContact.value = contact

    messages.value.push(createMessage('user', `\u{1F4E7} ${contact.email}\n\u{1F4F1} ${contact.phone}`))

    currentStep.value = 'sending-email'
    isLoading.value = true

    try {
      const conversation = messages.value
        .filter((m) => !m.actionType && !m.offer && !m.isLoading)
        .map((m) => ({ role: m.role, content: m.content }))

      await sendOfferEmail({
        projectDescription: projectDescription.value,
        selectedBudget: selectedBudget.value.label,
        selectedTimeline: `${selectedTimeline.value.label} (${selectedTimeline.value.weeks} weeks)`,
        generatedOffer: currentOffer.value,
        clientContact: contact,
        conversation,
        language: selectedLanguage.value,
        timestamp: Date.now(),
      })

      incrementSessionCount()

      const successMsgs: Record<string, string> = {
        en: `Thank you, ${contact.email}! Your offer request has been sent to Ion Rusu. He will review your project details and contact you shortly. You'll receive a confirmation at your email address.`,
        ro: `Mul\u021Bumim, ${contact.email}! Cererea dvs. de ofert\u0103 a fost trimis\u0103 lui Ion Rusu. El va analiza detaliile proiectului \u0219i v\u0103 va contacta \u00EEn cur\u00E2nd. Ve\u021Bi primi o confirmare la adresa de email.`,
        ru: `\u0421\u043F\u0430\u0441\u0438\u0431\u043E, ${contact.email}! \u0412\u0430\u0448 \u0437\u0430\u043F\u0440\u043E\u0441 \u043D\u0430 \u043F\u0440\u0435\u0434\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0431\u044B\u043B \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u0435\u043D \u0418\u043E\u043D\u0443 \u0420\u0443\u0441\u0443. \u041E\u043D \u0440\u0430\u0441\u0441\u043C\u043E\u0442\u0440\u0438\u0442 \u0434\u0435\u0442\u0430\u043B\u0438 \u0432\u0430\u0448\u0435\u0433\u043E \u043F\u0440\u043E\u0435\u043A\u0442\u0430 \u0438 \u0441\u0432\u044F\u0436\u0435\u0442\u0441\u044F \u0441 \u0432\u0430\u043C\u0438 \u0432 \u0431\u043B\u0438\u0436\u0430\u0439\u0448\u0435\u0435 \u0432\u0440\u0435\u043C\u044F.`,
      }

      messages.value.push(
        createMessage('assistant', successMsgs[selectedLanguage.value] || successMsgs.en),
      )

      currentStep.value = 'completed'
    } catch {
      messages.value.push(
        createMessage('assistant',
          selectedLanguage.value === 'ro'
            ? 'Nu am putut trimite oferta. Contacta\u021Bi-l pe Ion direct la ionrusu114@gmail.com'
            : 'Couldn\'t send the offer. Contact Ion directly at ionrusu114@gmail.com'),
      )
      currentStep.value = 'completed'
      incrementSessionCount()
    } finally {
      isLoading.value = false
    }
  }

  function declineOffer(): void {
    incrementSessionCount()

    const declineLabels: Record<string, string> = {
      en: 'Not for me',
      ro: 'Nu m\u0103 intereseaz\u0103',
      ru: '\u041D\u0435 \u0434\u043B\u044F \u043C\u0435\u043D\u044F',
    }
    messages.value.push(createMessage('user', declineLabels[selectedLanguage.value] || declineLabels.en))

    const closingMsgs: Record<string, string> = {
      en: 'No problem! If you change your mind, feel free to come back. You can also reach Ion directly at ionrusu114@gmail.com.',
      ro: 'Nicio problem\u0103! Dac\u0103 v\u0103 r\u0103zg\u00E2ndi\u021Bi, reveni\u021Bi oric\u00E2nd. \u00CEl pute\u021Bi contacta pe Ion direct la ionrusu114@gmail.com.',
      ru: '\u0411\u0435\u0437 \u043F\u0440\u043E\u0431\u043B\u0435\u043C! \u0415\u0441\u043B\u0438 \u043F\u0435\u0440\u0435\u0434\u0443\u043C\u0430\u0435\u0442\u0435, \u0432\u043E\u0437\u0432\u0440\u0430\u0449\u0430\u0439\u0442\u0435\u0441\u044C. \u0422\u0430\u043A\u0436\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u0441\u0432\u044F\u0437\u0430\u0442\u044C\u0441\u044F \u0441 \u0418\u043E\u043D\u043E\u043C \u043D\u0430\u043F\u0440\u044F\u043C\u0443\u044E: ionrusu114@gmail.com.',
    }

    messages.value.push(
      createMessage('assistant', closingMsgs[selectedLanguage.value] || closingMsgs.en),
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
    selectedLanguage,
    initialize,
    selectLanguage,
    sendMessage,
    selectBudget,
    submitCustomBudget,
    selectTimeline,
    handleOfferResponse,
    submitContact,
  }
}
