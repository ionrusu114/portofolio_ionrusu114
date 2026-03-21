import { ref, computed, onMounted, onUnmounted, provide, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollProgressKey, ScrollToPanelKey, CurrentPanelKey } from '@/types'

gsap.registerPlugin(ScrollTrigger)

interface UseHorizontalScrollOptions {
  panelCount: number
  scrubSpeed?: number
}

interface UseHorizontalScrollReturn {
  progress: Ref<number>
  currentPanelIndex: Ref<number>
  scrollToPanel: (index: number) => void
  timeline: () => gsap.core.Timeline | null
}

export function useHorizontalScroll(
  wrapperRef: Ref<HTMLElement | null>,
  containerRef: Ref<HTMLElement | null>,
  options: UseHorizontalScrollOptions,
): UseHorizontalScrollReturn {
  const { panelCount, scrubSpeed = 1 } = options

  const progress = ref(0)
  const currentPanelIndex = computed(() =>
    Math.round(progress.value * (panelCount - 1)),
  )

  let tl: gsap.core.Timeline | null = null
  let scrollTriggerInstance: ScrollTrigger | null = null

  function scrollToPanel(index: number): void {
    if (!scrollTriggerInstance) return
    const targetProgress = index / (panelCount - 1)
    const scrollPosition = scrollTriggerInstance.start +
      targetProgress * (scrollTriggerInstance.end - scrollTriggerInstance.start)
    gsap.to(window, {
      scrollTo: scrollPosition,
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }

  onMounted(() => {
    if (!wrapperRef.value || !containerRef.value) return

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.value,
        pin: true,
        start: 'top top',
        end: () => `+=${containerRef.value!.scrollWidth - window.innerWidth}`,
        scrub: scrubSpeed,
        snap: {
          snapTo: 1 / (panelCount - 1),
          duration: { min: 0.2, max: 0.6 },
          ease: 'power1.inOut',
        },
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.value = self.progress
        },
      },
    })

    tl.to(containerRef.value, {
      xPercent: -100 * (panelCount - 1) / panelCount * 100,
      ease: 'none',
    })

    scrollTriggerInstance = ScrollTrigger.getAll().find(
      (st) => st.vars.trigger === wrapperRef.value,
    ) ?? null
  })

  onUnmounted(() => {
    tl?.kill()
    scrollTriggerInstance?.kill()
    tl = null
    scrollTriggerInstance = null
  })

  // Provide for child components
  provide(ScrollProgressKey, progress)
  provide(ScrollToPanelKey, scrollToPanel)
  provide(CurrentPanelKey, currentPanelIndex)

  return {
    progress,
    currentPanelIndex,
    scrollToPanel,
    timeline: () => tl,
  }
}
