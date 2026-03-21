import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref } from 'vue'

vi.mock('three', () => {
  const MockBufferAttribute = vi.fn((array: Float32Array, size: number) => ({
    array,
    itemSize: size,
    needsUpdate: false,
  }))

  return {
    WebGLRenderer: vi.fn(() => ({
      setPixelRatio: vi.fn(),
      setSize: vi.fn(),
      render: vi.fn(),
      dispose: vi.fn(),
      domElement: document.createElement('canvas'),
    })),
    Scene: vi.fn(() => ({
      add: vi.fn(),
      traverse: vi.fn(),
    })),
    PerspectiveCamera: vi.fn(() => ({
      position: { x: 0, y: 0, z: 0, set: vi.fn() },
      aspect: 1,
      updateProjectionMatrix: vi.fn(),
    })),
    BufferGeometry: vi.fn(() => ({
      setAttribute: vi.fn(),
      attributes: {
        position: { array: new Float32Array(600 * 3), needsUpdate: false },
        velocity: { array: new Float32Array(600 * 3), needsUpdate: false },
      },
      dispose: vi.fn(),
    })),
    BufferAttribute: MockBufferAttribute,
    PointsMaterial: vi.fn(() => ({
      dispose: vi.fn(),
      opacity: 0.6,
    })),
    Points: vi.fn(() => ({
      geometry: {
        attributes: {
          position: { array: new Float32Array(600 * 3), needsUpdate: false },
          velocity: { array: new Float32Array(600 * 3), needsUpdate: false },
        },
        dispose: vi.fn(),
      },
      material: { dispose: vi.fn(), opacity: 0.6 },
    })),
    IcosahedronGeometry: vi.fn(() => ({ dispose: vi.fn() })),
    OctahedronGeometry: vi.fn(() => ({ dispose: vi.fn() })),
    TorusGeometry: vi.fn(() => ({ dispose: vi.fn() })),
    MeshBasicMaterial: vi.fn(() => ({
      dispose: vi.fn(),
      clone: vi.fn(() => ({ dispose: vi.fn() })),
    })),
    Mesh: vi.fn(() => ({
      position: { x: 0, y: 0, z: 0, set: vi.fn() },
      rotation: { x: 0, y: 0 },
      geometry: { dispose: vi.fn() },
      material: { dispose: vi.fn() },
    })),
    AdditiveBlending: 2,
  }
})

import { useThreeBackground } from '../useThreeBackground'

describe('useThreeBackground', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns dispose function', () => {
    const canvasRef = ref(null)
    const progress = ref(0)
    const { dispose } = useThreeBackground(canvasRef, progress)
    expect(typeof dispose).toBe('function')
  })

  it('does not throw when canvas is null', () => {
    const canvasRef = ref(null)
    const progress = ref(0)
    expect(() => useThreeBackground(canvasRef, progress)).not.toThrow()
  })

  it('accepts custom options', () => {
    const canvasRef = ref(null)
    const progress = ref(0)
    expect(() =>
      useThreeBackground(canvasRef, progress, {
        particleCount: 200,
        particleColor: 0xff0000,
      }),
    ).not.toThrow()
  })
})
