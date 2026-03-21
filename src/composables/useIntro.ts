import { ref, computed } from 'vue'

const STORAGE_KEY = 'portfolio_intro_seen'

export function useIntro() {
  const hasSeenIntro = ref(
    typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true',
  )
  const isPlaying = ref(false)
  const isComplete = ref(false)

  const shouldShowIntro = computed(() => !hasSeenIntro.value && !isComplete.value)

  function skipIntro(): void {
    localStorage.setItem(STORAGE_KEY, 'true')
    hasSeenIntro.value = true
    isPlaying.value = false
    isComplete.value = true
  }

  function completeIntro(): void {
    localStorage.setItem(STORAGE_KEY, 'true')
    hasSeenIntro.value = true
    isPlaying.value = false
    isComplete.value = true
  }

  function startIntro(): void {
    isPlaying.value = true
  }

  return {
    hasSeenIntro,
    isPlaying,
    isComplete,
    shouldShowIntro,
    skipIntro,
    completeIntro,
    startIntro,
  }
}
