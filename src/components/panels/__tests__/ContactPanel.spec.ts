import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactPanel from '../ContactPanel.vue'

describe('ContactPanel', () => {
  it('renders section heading', () => {
    const wrapper = mount(ContactPanel)
    expect(wrapper.text()).toContain("Let's Work")
    expect(wrapper.text()).toContain('Together')
  })

  it('renders LinkedIn link', () => {
    const wrapper = mount(ContactPanel)
    expect(wrapper.text()).toContain('LinkedIn')
  })

  it('renders GitHub link', () => {
    const wrapper = mount(ContactPanel)
    expect(wrapper.text()).toContain('GitHub')
  })

  it('renders email', () => {
    const wrapper = mount(ContactPanel)
    expect(wrapper.text()).toContain('ionrusu114@gmail.com')
  })

  it('renders phone number', () => {
    const wrapper = mount(ContactPanel)
    expect(wrapper.text()).toContain('+40756754066')
  })
})
