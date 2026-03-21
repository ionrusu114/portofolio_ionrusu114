import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import GetOfferPanel from '../GetOfferPanel.vue'

describe('GetOfferPanel', () => {
  it('renders section heading', () => {
    const wrapper = mount(GetOfferPanel)
    expect(wrapper.text()).toContain("Let's Build Something")
  })

  it('renders chat interface with demo messages', () => {
    const wrapper = mount(GetOfferPanel)
    expect(wrapper.text()).toContain('Describe your project')
  })

  it('renders budget options', () => {
    const wrapper = mount(GetOfferPanel)
    expect(wrapper.text()).toContain('Budget Range')
  })

  it('renders timeline selector', () => {
    const wrapper = mount(GetOfferPanel)
    expect(wrapper.text()).toContain('Timeline')
  })
})
