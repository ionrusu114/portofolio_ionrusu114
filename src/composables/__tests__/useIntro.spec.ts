import { describe, it, expect, beforeEach } from 'vitest'
import { useIntro } from '../useIntro'

describe('useIntro', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows intro on first visit', () => {
    const { shouldShowIntro } = useIntro()
    expect(shouldShowIntro.value).toBe(true)
  })

  it('hides intro after skip', () => {
    const { shouldShowIntro, skipIntro } = useIntro()
    skipIntro()
    expect(shouldShowIntro.value).toBe(false)
  })

  it('saves to localStorage on skip', () => {
    const { skipIntro } = useIntro()
    skipIntro()
    expect(localStorage.getItem('portfolio_intro_seen')).toBe('true')
  })

  it('hides intro for returning visitors', () => {
    localStorage.setItem('portfolio_intro_seen', 'true')
    const { hasSeenIntro } = useIntro()
    expect(hasSeenIntro.value).toBe(true)
  })

  it('completeIntro marks as complete', () => {
    const { isComplete, completeIntro } = useIntro()
    completeIntro()
    expect(isComplete.value).toBe(true)
  })

  it('startIntro sets isPlaying', () => {
    const { isPlaying, startIntro } = useIntro()
    startIntro()
    expect(isPlaying.value).toBe(true)
  })
})
