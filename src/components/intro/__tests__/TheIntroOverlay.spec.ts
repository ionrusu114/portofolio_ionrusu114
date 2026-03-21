import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TheIntroOverlay from '../TheIntroOverlay.vue'

vi.mock('gsap', () => ({
  gsap: {
    from: vi.fn(),
    to: vi.fn(),
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      kill: vi.fn(),
      eventCallback: vi.fn(),
    })),
  },
}))

describe('TheIntroOverlay', () => {
  it('renders the overlay', () => {
    const wrapper = mount(TheIntroOverlay)
    expect(wrapper.find('.fixed.inset-0').exists()).toBe(true)
  })

  it('renders skip button', () => {
    const wrapper = mount(TheIntroOverlay)
    expect(wrapper.text()).toContain('Skip')
  })

  it('renders personal name', () => {
    const wrapper = mount(TheIntroOverlay)
    expect(wrapper.text()).toContain('Ion Rusu')
  })
})
