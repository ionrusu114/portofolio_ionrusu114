import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkillsSection from '../SkillsSection.vue'

describe('SkillsSection', () => {
  it('renders frontend category', () => {
    const wrapper = mount(SkillsSection)
    expect(wrapper.text()).toContain('Frontend')
  })

  it('renders backend category', () => {
    const wrapper = mount(SkillsSection)
    expect(wrapper.text()).toContain('Backend')
  })

  it('renders Vue.js skill', () => {
    const wrapper = mount(SkillsSection)
    expect(wrapper.text()).toContain('Vue.js')
  })
})
