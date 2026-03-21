import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import BaseRangeSlider from '../BaseRangeSlider.vue'

describe('BaseRangeSlider', () => {
  it('renders with current value', () => {
    const wrapper = mount(BaseRangeSlider, {
      props: { modelValue: 6, label: 'Months' },
    })
    expect(wrapper.text()).toContain('6')
  })

  it('renders label when provided', () => {
    const wrapper = mount(BaseRangeSlider, {
      props: { modelValue: 3, label: 'Timeline' },
    })
    expect(wrapper.text()).toContain('Timeline')
  })

  it('renders min and max values', () => {
    const wrapper = mount(BaseRangeSlider, {
      props: { modelValue: 5, min: 1, max: 12 },
    })
    expect(wrapper.text()).toContain('1')
    expect(wrapper.text()).toContain('12')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(BaseRangeSlider, {
      props: { modelValue: 5 },
    })
    await wrapper.find('input').setValue('8')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})
