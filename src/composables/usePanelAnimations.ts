import { onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function usePanelAnimations(
  panelRef: Ref<HTMLElement | null>,
  containerAnimation?: gsap.core.Timeline | null,
): void {
  let ctx: gsap.Context | null = null

  onMounted(() => {
    if (!panelRef.value) return

    ctx = gsap.context(() => {
      const headings = panelRef.value!.querySelectorAll('h1, h2, h3')
      const paragraphs = panelRef.value!.querySelectorAll('p')
      const buttons = panelRef.value!.querySelectorAll('button, a')

      const triggerConfig: ScrollTrigger.Vars = {
        trigger: panelRef.value!,
        start: 'left 80%',
        end: 'left 30%',
        toggleActions: 'play none none reverse',
      }

      if (containerAnimation) {
        triggerConfig.containerAnimation = containerAnimation
      }

      if (headings.length) {
        gsap.from(headings, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: triggerConfig,
        })
      }

      if (paragraphs.length) {
        gsap.from(paragraphs, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.2,
          ease: 'power2.out',
          scrollTrigger: { ...triggerConfig },
        })
      }

      if (buttons.length) {
        gsap.from(buttons, {
          y: 15,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          delay: 0.4,
          ease: 'power2.out',
          scrollTrigger: { ...triggerConfig },
        })
      }
    }, panelRef.value)
  })

  onUnmounted(() => {
    ctx?.revert()
    ctx = null
  })
}
