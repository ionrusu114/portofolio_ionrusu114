import { onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'

export function useGsapContext(
  scopeRef: Ref<HTMLElement | null>,
  animationFn: () => void,
): { context: () => gsap.Context | null } {
  let ctx: gsap.Context | null = null

  onMounted(() => {
    if (!scopeRef.value) return
    ctx = gsap.context(animationFn, scopeRef.value)
  })

  onUnmounted(() => {
    ctx?.revert()
    ctx = null
  })

  return {
    context: () => ctx,
  }
}
