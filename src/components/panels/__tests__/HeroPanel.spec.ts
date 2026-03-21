import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HeroPanel from '../HeroPanel.vue'

describe('HeroPanel', () => {
  it('renders the name', () => {
    const wrapper = mount(HeroPanel)
    expect(wrapper.text()).toContain('Ion Rusu')
  })

  it('renders the title', () => {
    const wrapper = mount(HeroPanel)
    expect(wrapper.text()).toContain('Web Application Architect & Developer')
  })

  it('renders View Projects button', () => {
    const wrapper = mount(HeroPanel)
    expect(wrapper.text()).toContain('View Projects')
  })

  it('renders Get in Touch button', () => {
    const wrapper = mount(HeroPanel)
    expect(wrapper.text()).toContain('Get in Touch')
  })
})
