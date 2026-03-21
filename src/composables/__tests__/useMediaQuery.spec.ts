import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import { useMediaQuery } from '../useMediaQuery'

describe('useMediaQuery', () => {
  let addListenerSpy: ReturnType<typeof vi.fn>
  let removeListenerSpy: ReturnType<typeof vi.fn>

  beforeEach(() => {
    addListenerSpy = vi.fn()
    removeListenerSpy = vi.fn()

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: query === '(min-width: 1024px)',
        media: query,
        addEventListener: addListenerSpy,
        removeEventListener: removeListenerSpy,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    })
  })

  it('returns true when query matches', async () => {
    let result: ReturnType<typeof useMediaQuery> | undefined

    const TestComponent = defineComponent({
      setup() {
        result = useMediaQuery('(min-width: 1024px)')
        return {}
      },
      template: '<div />',
    })

    mount(TestComponent)
    await nextTick()

    expect(result!.value).toBe(true)
  })

  it('returns false when query does not match', async () => {
    let result: ReturnType<typeof useMediaQuery> | undefined

    const TestComponent = defineComponent({
      setup() {
        result = useMediaQuery('(max-width: 768px)')
        return {}
      },
      template: '<div />',
    })

    mount(TestComponent)
    await nextTick()

    expect(result!.value).toBe(false)
  })

  it('adds event listener on mount', async () => {
    const TestComponent = defineComponent({
      setup() {
        useMediaQuery('(min-width: 1024px)')
        return {}
      },
      template: '<div />',
    })

    mount(TestComponent)
    await nextTick()

    expect(addListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })

  it('removes event listener on unmount', async () => {
    const TestComponent = defineComponent({
      setup() {
        useMediaQuery('(min-width: 1024px)')
        return {}
      },
      template: '<div />',
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    wrapper.unmount()

    expect(removeListenerSpy).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
