import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseChatBubble from '../BaseChatBubble.vue'

describe('BaseChatBubble', () => {
  it('renders slot content', () => {
    const wrapper = mount(BaseChatBubble, {
      props: { role: 'user' },
      slots: { default: 'Hello!' },
    })
    expect(wrapper.text()).toContain('Hello!')
  })

  it('applies user styling for user role', () => {
    const wrapper = mount(BaseChatBubble, {
      props: { role: 'user' },
      slots: { default: 'msg' },
    })
    expect(wrapper.find('div').classes()).toContain('chat-bubble--user')
  })

  it('applies assistant styling for assistant role', () => {
    const wrapper = mount(BaseChatBubble, {
      props: { role: 'assistant' },
      slots: { default: 'msg' },
    })
    expect(wrapper.find('div').classes()).toContain('chat-bubble--assistant')
  })

  it('applies assistant styling for system role', () => {
    const wrapper = mount(BaseChatBubble, {
      props: { role: 'system' },
      slots: { default: 'msg' },
    })
    expect(wrapper.find('div').classes()).toContain('chat-bubble--assistant')
  })
})
