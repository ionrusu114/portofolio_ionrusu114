import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    context: vi.fn(() => ({ revert: vi.fn() })),
    from: vi.fn(),
  },
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {},
}))

import { usePanelAnimations } from '../usePanelAnimations'

describe('usePanelAnimations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('does not throw when panel ref is null', () => {
    const panelRef = ref(null)
    expect(() => usePanelAnimations(panelRef)).not.toThrow()
  })

  it('accepts optional containerAnimation', () => {
    const panelRef = ref(null)
    expect(() => usePanelAnimations(panelRef, null)).not.toThrow()
  })
})
