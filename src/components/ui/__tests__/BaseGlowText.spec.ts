import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseGlowText from '../BaseGlowText.vue'

describe('BaseGlowText', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseGlowText, {
      slots: { default: 'Hello World' },
    })
    expect(wrapper.text()).toContain('Hello World')
  })

  it('renders as span by default', () => {
    const wrapper = mount(BaseGlowText, {
      slots: { default: 'Text' },
    })
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('renders as custom tag', () => {
    const wrapper = mount(BaseGlowText, {
      props: { tag: 'h1' },
      slots: { default: 'Title' },
    })
    expect(wrapper.element.tagName).toBe('H1')
  })

  it('applies glow-text class', () => {
    const wrapper = mount(BaseGlowText, {
      slots: { default: 'Glow' },
    })
    expect(wrapper.classes()).toContain('glow-text')
  })
})
