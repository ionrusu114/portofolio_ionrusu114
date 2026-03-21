import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BasePanel from '../BasePanel.vue'

describe('BasePanel', () => {
  it('renders with correct id attribute', () => {
    const wrapper = mount(BasePanel, { props: { id: 'hero' } })
    expect(wrapper.find('section').attributes('id')).toBe('hero')
  })

  it('applies panel class', () => {
    const wrapper = mount(BasePanel, { props: { id: 'about' } })
    expect(wrapper.find('section').classes()).toContain('panel')
  })

  it('renders slot content', () => {
    const wrapper = mount(BasePanel, {
      props: { id: 'hero' },
      slots: { default: '<h1>Hello</h1>' },
    })
    expect(wrapper.html()).toContain('Hello')
  })
})
