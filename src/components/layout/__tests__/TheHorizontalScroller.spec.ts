import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TheHorizontalScroller from '../TheHorizontalScroller.vue'

vi.mock('@/composables/useHorizontalScroll', () => ({
  useHorizontalScroll: vi.fn(() => ({
    progress: { value: 0 },
    currentPanelIndex: { value: 0 },
    scrollToPanel: vi.fn(),
    timeline: () => null,
  })),
}))

describe('TheHorizontalScroller', () => {
  it('renders wrapper and container divs', () => {
    const wrapper = mount(TheHorizontalScroller)
    expect(wrapper.find('.h-screen.w-screen').exists()).toBe(true)
    expect(wrapper.find('.flex.h-screen').exists()).toBe(true)
  })

  it('sets container width based on panel count', () => {
    const wrapper = mount(TheHorizontalScroller)
    const container = wrapper.find('.flex.h-screen')
    expect(container.attributes('style')).toContain('500vw')
  })

  it('renders slot content', () => {
    const wrapper = mount(TheHorizontalScroller, {
      slots: { default: '<div class="test-panel">Panel</div>' },
    })
    expect(wrapper.find('.test-panel').exists()).toBe(true)
  })
})
