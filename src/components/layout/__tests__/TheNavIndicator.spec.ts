import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TheNavIndicator from '../TheNavIndicator.vue'

describe('TheNavIndicator', () => {
  it('renders 5 navigation dots', () => {
    const wrapper = mount(TheNavIndicator)
    expect(wrapper.findAll('button').length).toBe(5)
  })

  it('has navigation aria-label', () => {
    const wrapper = mount(TheNavIndicator)
    expect(wrapper.find('nav').attributes('aria-label')).toBe('Page navigation')
  })
})
