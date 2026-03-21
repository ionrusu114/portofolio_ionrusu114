import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSkipButton from '../BaseSkipButton.vue'

describe('BaseSkipButton', () => {
  it('renders skip text', () => {
    const wrapper = mount(BaseSkipButton)
    expect(wrapper.text()).toContain('Skip')
  })

  it('emits skip event on click', async () => {
    const wrapper = mount(BaseSkipButton)
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('skip')).toHaveLength(1)
  })
})
