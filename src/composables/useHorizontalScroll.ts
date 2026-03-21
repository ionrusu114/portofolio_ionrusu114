import { ref, computed, onMounted, onUnmounted, provide, type Ref } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollProgressKey, ScrollToPanelKey, CurrentPanelKey } from '@/types'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

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
  let st: ScrollTrigger | null = null

  function scrollToPanel(index: number): void {
    if (!st) return
    const targetProgress = index / (panelCount - 1)
    const scrollPos = st.start + targetProgress * (st.end - st.start)
    gsap.to(window, {
      scrollTo: { y: scrollPos, autoKill: false },
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }

  onMounted(() => {
    if (!wrapperRef.value || !containerRef.value) return

    const movePercent = ((panelCount - 1) / panelCount) * 100

    tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.value,
        pin: true,
        start: 'top top',
        end: () => `+=${(panelCount - 1) * window.innerWidth}`,
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
      xPercent: -movePercent,
      ease: 'none',
    })

    // Store the ScrollTrigger instance directly
    st = tl.scrollTrigger as ScrollTrigger
  })

  onUnmounted(() => {
    tl?.kill()
    st = null
    tl = null
  })

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
