import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

const mockObserver = { kill: vi.fn() }

vi.mock('gsap', () => ({
  gsap: { registerPlugin: vi.fn() },
}))

vi.mock('gsap/Observer', () => ({
  Observer: {
    create: vi.fn(() => mockObserver),
  },
}))

import { useTouchSwipe } from '../useTouchSwipe'

describe('useTouchSwipe', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not throw when called with valid args', () => {
    const scrollToPanel = vi.fn()
    const currentPanelIndex = ref(0)
    expect(() => useTouchSwipe(scrollToPanel, currentPanelIndex, 5)).not.toThrow()
  })
})
