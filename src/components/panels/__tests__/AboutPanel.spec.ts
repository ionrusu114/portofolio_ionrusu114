import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AboutPanel from '../AboutPanel.vue'

describe('AboutPanel', () => {
  it('renders about section heading', () => {
    const wrapper = mount(AboutPanel)
    expect(wrapper.text()).toContain('Building solutions')
  })

  it('renders bio text', () => {
    const wrapper = mount(AboutPanel)
    expect(wrapper.text()).toContain('end-to-end web solutions')
  })

  it('renders education info', () => {
    const wrapper = mount(AboutPanel)
    expect(wrapper.text()).toContain('Gheorghe Asachi')
  })

  it('renders languages', () => {
    const wrapper = mount(AboutPanel)
    expect(wrapper.text()).toContain('Romanian')
    expect(wrapper.text()).toContain('Russian')
    expect(wrapper.text()).toContain('English')
  })
})
