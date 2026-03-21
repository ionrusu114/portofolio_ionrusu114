import { onMounted, onUnmounted, type Ref } from 'vue'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'

gsap.registerPlugin(Observer)

export function useTouchSwipe(
  scrollToPanel: (index: number) => void,
  currentPanelIndex: Ref<number>,
  totalPanels: number,
): void {
  let observerInstance: ReturnType<typeof Observer.create> | null = null

  onMounted(() => {
    observerInstance = Observer.create({
      type: 'touch',
      tolerance: 50,
      onLeft: () => {
        const next = Math.min(currentPanelIndex.value + 1, totalPanels - 1)
        scrollToPanel(next)
      },
      onRight: () => {
        const prev = Math.max(currentPanelIndex.value - 1, 0)
        scrollToPanel(prev)
      },
    })
  })

  onUnmounted(() => {
    observerInstance?.kill()
    observerInstance = null
  })
}
