import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

// Mock gsap
vi.mock('gsap', () => {
  const mockContext = {
    revert: vi.fn(),
    add: vi.fn(),
  }
  return {
    gsap: {
      context: vi.fn(() => mockContext),
    },
  }
})

import { useGsapContext } from '../useGsapContext'
import { gsap } from 'gsap'

describe('useGsapContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates gsap context on mount with scope element', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        const animFn = vi.fn()
        useGsapContext(elRef, animFn)
        return { elRef }
      },
      template: '<div ref="elRef">test</div>',
    })

    mount(TestComponent)
    await nextTick()

    expect(gsap.context).toHaveBeenCalledTimes(1)
  })

  it('does not create context when ref is null', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        useGsapContext(elRef, vi.fn())
        return { elRef }
      },
      template: '<div>no ref bound</div>',
    })

    mount(TestComponent)
    await nextTick()

    expect(gsap.context).not.toHaveBeenCalled()
  })

  it('reverts context on unmount', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        useGsapContext(elRef, vi.fn())
        return { elRef }
      },
      template: '<div ref="elRef">test</div>',
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    const mockCtx = (gsap.context as ReturnType<typeof vi.fn>).mock.results[0].value
    wrapper.unmount()

    expect(mockCtx.revert).toHaveBeenCalledTimes(1)
  })
})
