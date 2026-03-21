import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheNavMenu from '../TheNavMenu.vue'

describe('TheNavMenu', () => {
  it('renders menu toggle button', () => {
    const wrapper = mount(TheNavMenu)
    expect(wrapper.find('button[aria-label="Toggle menu"]').exists()).toBe(true)
  })

  it('menu is hidden by default', () => {
    const wrapper = mount(TheNavMenu)
    expect(wrapper.find('[aria-expanded]').attributes('aria-expanded')).toBe('false')
  })

  it('toggles menu on button click', async () => {
    const wrapper = mount(TheNavMenu)
    const toggleBtn = wrapper.find('button[aria-label="Toggle menu"]')
    await toggleBtn.trigger('click')
    expect(toggleBtn.attributes('aria-expanded')).toBe('true')
  })
})
