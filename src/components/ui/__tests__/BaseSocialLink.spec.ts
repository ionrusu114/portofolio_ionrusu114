import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseSocialLink from '../BaseSocialLink.vue'

describe('BaseSocialLink', () => {
  const props = {
    href: 'https://github.com/ionrusu114',
    icon: 'fa-github',
    label: 'GitHub',
  }

  it('renders link with correct href', () => {
    const wrapper = mount(BaseSocialLink, { props })
    expect(wrapper.find('a').attributes('href')).toBe(props.href)
  })

  it('opens in new tab', () => {
    const wrapper = mount(BaseSocialLink, { props })
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
    expect(wrapper.find('a').attributes('rel')).toContain('noopener')
  })

  it('renders label text', () => {
    const wrapper = mount(BaseSocialLink, { props })
    expect(wrapper.text()).toContain('GitHub')
  })
})
