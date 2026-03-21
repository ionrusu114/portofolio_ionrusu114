import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TheBackgroundCanvas from '../TheBackgroundCanvas.vue'

vi.mock('@/composables/useThreeBackground', () => ({
  useThreeBackground: vi.fn(() => ({ dispose: vi.fn() })),
}))

vi.mock('@/composables/useMediaQuery', () => ({
  useMediaQuery: vi.fn(() => ({ value: false })),
}))

describe('TheBackgroundCanvas', () => {
  it('renders a canvas element', () => {
    const wrapper = mount(TheBackgroundCanvas)
    expect(wrapper.find('canvas').exists()).toBe(true)
  })

  it('has aria-hidden for accessibility', () => {
    const wrapper = mount(TheBackgroundCanvas)
    expect(wrapper.find('canvas').attributes('aria-hidden')).toBe('true')
  })

  it('has pointer-events-none class', () => {
    const wrapper = mount(TheBackgroundCanvas)
    expect(wrapper.find('canvas').classes()).toContain('pointer-events-none')
  })
})
