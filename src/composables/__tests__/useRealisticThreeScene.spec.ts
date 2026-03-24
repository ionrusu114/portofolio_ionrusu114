import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useRealisticThreeScene } from '../useRealisticThreeScene'
import { ref } from 'vue'

// Basic mock for DOM/Three.js to avoid WebGL context errors in jsdom
vi.mock('three', async () => {
  const actual = await vi.importActual('three')
  return {
    ...actual,
    WebGLRenderer: vi.fn().mockImplementation(() => ({
      setSize: vi.fn(),
      setPixelRatio: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
    })),
  }
})

describe('useRealisticThreeScene', () => {
  let canvas: HTMLCanvasElement

  beforeEach(() => {
    canvas = document.createElement('canvas')
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => setTimeout(cb, 16) as unknown as number)
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(clearTimeout as unknown as (handle: number) => void)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllMocks()
  })

  it('provides a dispose function and initializes correctly', () => {
    const canvasRef = ref(canvas)
    const scrollProgress = ref(0)
    
    const { dispose } = useRealisticThreeScene(canvasRef, scrollProgress, { particleCount: 100 })
    expect(dispose).toBeTypeOf('function')
    
    // Call dispose to verify cleanup logic doesn't crash
    expect(() => dispose()).not.toThrow()
  })
})
