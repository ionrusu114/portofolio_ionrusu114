import { ref, computed, onMounted, onUnmounted, provide, watch, type Ref } from 'vue'
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
  isMobile: Ref<boolean>
  timeline: () => gsap.core.Timeline | null
}

export function useHorizontalScroll(
  wrapperRef: Ref<HTMLElement | null>,
  containerRef: Ref<HTMLElement | null>,
  options: UseHorizontalScrollOptions,
): UseHorizontalScrollReturn {
  const { panelCount, scrubSpeed = 1 } = options

  const progress = ref(0)
  const isMobile = ref(false)
  const currentPanelIndex = computed(() =>
    Math.round(progress.value * (panelCount - 1)),
  )

  let tl: gsap.core.Timeline | null = null
  let st: ScrollTrigger | null = null
  let mql: MediaQueryList | null = null

  // === MOBILE: scroll-snap based navigation ===
  function setupMobile(): void {
    if (!containerRef.value) return

    // Listen to native scroll for progress tracking
    containerRef.value.addEventListener('scroll', handleMobileScroll, { passive: true })
  }

  function handleMobileScroll(): void {
    if (!containerRef.value) return
    const el = containerRef.value
    const maxScroll = el.scrollWidth - el.clientWidth
    if (maxScroll > 0) {
      progress.value = el.scrollLeft / maxScroll
    }
  }

  function cleanupMobile(): void {
    containerRef.value?.removeEventListener('scroll', handleMobileScroll)
  }

  // === DESKTOP: GSAP ScrollTrigger horizontal scroll ===
  function setupDesktop(): void {
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
          duration: { min: 0.15, max: 0.4 },
          delay: 0,
          ease: 'power2.inOut',
          directional: false,
          inertia: false,
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

    st = tl.scrollTrigger as ScrollTrigger
  }

  function cleanupDesktop(): void {
    tl?.kill()
    st?.kill()
    tl = null
    st = null
    // Reset any GSAP-applied styles
    if (containerRef.value) {
      gsap.set(containerRef.value, { clearProps: 'all' })
    }
    if (wrapperRef.value) {
      gsap.set(wrapperRef.value, { clearProps: 'all' })
    }
    ScrollTrigger.refresh()
  }

  // === SCROLL TO PANEL (works for both modes) ===
  function scrollToPanel(index: number): void {
    if (isMobile.value) {
      if (!containerRef.value) return
      const panelWidth = containerRef.value.clientWidth
      containerRef.value.scrollTo({
        left: index * panelWidth,
        behavior: 'smooth',
      })
    } else {
      if (!st) return
      const targetProgress = index / (panelCount - 1)
      const scrollPos = st.start + targetProgress * (st.end - st.start)
      gsap.to(window, {
        scrollTo: { y: scrollPos, autoKill: false },
        duration: 0.8,
        ease: 'power2.inOut',
      })
    }
  }

  // === LIFECYCLE ===
  function handleMediaChange(e: MediaQueryListEvent): void {
    const wasMobile = isMobile.value
    isMobile.value = e.matches

    if (wasMobile && !isMobile.value) {
      cleanupMobile()
      // Small delay to let DOM update
      setTimeout(() => setupDesktop(), 50)
    } else if (!wasMobile && isMobile.value) {
      cleanupDesktop()
      setTimeout(() => setupMobile(), 50)
    }
  }

  onMounted(() => {
    mql = window.matchMedia('(max-width: 767px)')
    isMobile.value = mql.matches
    mql.addEventListener('change', handleMediaChange)

    if (isMobile.value) {
      setupMobile()
    } else {
      setupDesktop()
    }

    // Restore tab from URL
    const params = new URLSearchParams(window.location.search)
    const tabParam = params.get('tab')
    if (tabParam) {
      const tabIndex = parseInt(tabParam, 10)
      if (!isNaN(tabIndex) && tabIndex >= 0 && tabIndex < panelCount) {
        setTimeout(() => scrollToPanel(tabIndex), 100)
      }
    }
  })

  onUnmounted(() => {
    mql?.removeEventListener('change', handleMediaChange)
    if (isMobile.value) {
      cleanupMobile()
    } else {
      cleanupDesktop()
    }
  })

  provide(ScrollProgressKey, progress)
  provide(ScrollToPanelKey, scrollToPanel)
  provide(CurrentPanelKey, currentPanelIndex)

  // Sync panel index to URL
  watch(currentPanelIndex, (index) => {
    const url = new URL(window.location.href)
    if (index === 0) {
      url.searchParams.delete('tab')
    } else {
      url.searchParams.set('tab', String(index))
    }
    window.history.replaceState({}, '', url.toString())
  })

  return {
    progress,
    currentPanelIndex,
    scrollToPanel,
    isMobile,
    timeline: () => tl,
  }
}
