import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseTag from '../BaseTag.vue'

describe('BaseTag', () => {
  it('renders label text', () => {
    const wrapper = mount(BaseTag, { props: { label: 'Vue.js' } })
    expect(wrapper.text()).toContain('Vue.js')
  })

  it('applies active styles when active', () => {
    const wrapper = mount(BaseTag, { props: { label: 'Vue.js', active: true } })
    expect(wrapper.find('span').classes()).toContain('border-accent')
  })

  it('applies inactive styles by default', () => {
    const wrapper = mount(BaseTag, { props: { label: 'Vue.js' } })
    expect(wrapper.find('span').classes()).toContain('border-border')
  })
})
