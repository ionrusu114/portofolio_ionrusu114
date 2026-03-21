import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('gsap', () => {
  const mockTimeline = {
    to: vi.fn().mockReturnThis(),
    kill: vi.fn(),
  }
  return {
    gsap: {
      timeline: vi.fn(() => mockTimeline),
      to: vi.fn(),
      registerPlugin: vi.fn(),
    },
  }
})

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    getAll: vi.fn(() => []),
  },
}))

vi.mock('@/types', () => ({
  ScrollProgressKey: Symbol('scrollProgress'),
  ScrollToPanelKey: Symbol('scrollToPanel'),
  CurrentPanelKey: Symbol('currentPanelIndex'),
}))

import { useHorizontalScroll } from '../useHorizontalScroll'

describe('useHorizontalScroll', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns progress ref initialized to 0', () => {
    const wrapperRef = ref(null)
    const containerRef = ref(null)
    const { progress } = useHorizontalScroll(wrapperRef, containerRef, { panelCount: 5 })
    expect(progress.value).toBe(0)
  })

  it('computes currentPanelIndex from progress', () => {
    const wrapperRef = ref(null)
    const containerRef = ref(null)
    const { progress, currentPanelIndex } = useHorizontalScroll(wrapperRef, containerRef, { panelCount: 5 })

    progress.value = 0.5
    expect(currentPanelIndex.value).toBe(2) // Math.round(0.5 * 4) = 2

    progress.value = 0.75
    expect(currentPanelIndex.value).toBe(3) // Math.round(0.75 * 4) = 3
  })

  it('computes panel 0 for progress 0', () => {
    const wrapperRef = ref(null)
    const containerRef = ref(null)
    const { currentPanelIndex } = useHorizontalScroll(wrapperRef, containerRef, { panelCount: 5 })
    expect(currentPanelIndex.value).toBe(0)
  })
})
