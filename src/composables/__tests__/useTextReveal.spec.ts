import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('gsap', () => {
  const mockTimeline = {
    from: vi.fn().mockReturnThis(),
    reverse: vi.fn(),
    kill: vi.fn(),
    eventCallback: vi.fn(),
  }
  return {
    gsap: {
      timeline: vi.fn(() => mockTimeline),
    },
  }
})

import { useTextReveal } from '../useTextReveal'

describe('useTextReveal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns play and reverse functions', () => {
    const elRef = ref(null)
    const { play, reverse } = useTextReveal(elRef)
    expect(typeof play).toBe('function')
    expect(typeof reverse).toBe('function')
  })

  it('play returns null when element is null', () => {
    const elRef = ref(null)
    const { play } = useTextReveal(elRef)
    expect(play()).toBeNull()
  })

  it('play returns timeline when element exists', () => {
    const el = document.createElement('div')
    el.querySelectorAll = vi.fn(() => [] as any)
    const elRef = ref(el)
    const { play } = useTextReveal(elRef as any)
    const result = play()
    expect(result).not.toBeNull()
  })
})
