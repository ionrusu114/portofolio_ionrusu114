import { onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'

export function useTextReveal(
  elementRef: Ref<HTMLElement | null>,
  options: {
    delay?: number
    duration?: number
    stagger?: number
    y?: number
  } = {},
) {
  const { delay = 0, duration = 0.6, stagger = 0.03, y = 40 } = options

  let tl: gsap.core.Timeline | null = null

  function play(): gsap.core.Timeline | null {
    if (!elementRef.value) return null

    const chars = elementRef.value.querySelectorAll('.char')
    if (!chars.length) {
      // Fallback: animate the element itself
      tl = gsap.timeline()
      tl.from(elementRef.value, {
        y,
        opacity: 0,
        duration,
        delay,
        ease: 'power2.out',
      })
      return tl
    }

    tl = gsap.timeline()
    tl.from(chars, {
      y,
      opacity: 0,
      rotateX: -90,
      stagger,
      duration,
      delay,
      ease: 'back.out(1.7)',
      transformOrigin: 'center bottom',
    })

    return tl
  }

  function reverse(): void {
    tl?.reverse()
  }

  onUnmounted(() => {
    tl?.kill()
    tl = null
  })

  return { play, reverse }
}
