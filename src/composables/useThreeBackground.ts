import { onMounted, onUnmounted, type Ref } from 'vue'
import * as THREE from 'three'

interface ThreeBackgroundOptions {
  particleCount?: number
  particleColor?: number
  geometryColor?: number
}

export function useThreeBackground(
  canvasRef: Ref<HTMLCanvasElement | null>,
  scrollProgress: Ref<number>,
  options: ThreeBackgroundOptions = {},
): { dispose: () => void } {
  const {
    particleCount = 600,
    particleColor = 0x00ff88,
    geometryColor = 0x00ff88,
  } = options

  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let particles: THREE.Points | null = null
  let geometries: THREE.Mesh[] = []
  let animationId: number | null = null

  function init(): void {
    if (!canvasRef.value) return

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value,
      antialias: true,
      alpha: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvasRef.value.clientWidth, canvasRef.value.clientHeight)

    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.value.clientWidth / canvasRef.value.clientHeight,
      0.1,
      1000,
    )
    camera.position.z = 5

    createParticles()
    createFloatingGeometries()

    window.addEventListener('resize', handleResize)
    startLoop()
  }

  function createParticles(): void {
    if (!scene) return

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = (Math.random() - 0.5) * 20
      positions[i + 2] = (Math.random() - 0.5) * 15
      velocities[i] = (Math.random() - 0.5) * 0.002
      velocities[i + 1] = (Math.random() - 0.5) * 0.002 + 0.001
      velocities[i + 2] = (Math.random() - 0.5) * 0.001
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))

    const material = new THREE.PointsMaterial({
      size: 0.03,
      color: particleColor,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
  }

  function createFloatingGeometries(): void {
    if (!scene) return

    const shapes = [
      new THREE.IcosahedronGeometry(0.8, 1),
      new THREE.OctahedronGeometry(0.6, 0),
      new THREE.TorusGeometry(0.5, 0.15, 8, 16),
    ]

    const material = new THREE.MeshBasicMaterial({
      color: geometryColor,
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    })

    shapes.forEach((geo, i) => {
      const mesh = new THREE.Mesh(geo, material.clone())
      mesh.position.set(
        (i - 1) * 6,
        (Math.random() - 0.5) * 4,
        -3 - Math.random() * 3,
      )
      scene!.add(mesh)
      geometries.push(mesh)
    })
  }

  function handleResize(): void {
    if (!canvasRef.value || !renderer || !camera) return
    const width = canvasRef.value.clientWidth
    const height = canvasRef.value.clientHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
  }

  function startLoop(): void {
    function tick(): void {
      if (!renderer || !scene || !camera) return

      const time = performance.now() * 0.001
      const progress = scrollProgress.value

      // Animate particles
      if (particles) {
        const positions = particles.geometry.attributes.position
        const velocities = particles.geometry.attributes.velocity

        for (let i = 0; i < particleCount * 3; i += 3) {
          const posArray = positions.array as Float32Array
          const velArray = velocities.array as Float32Array

          posArray[i] += velArray[i]
          posArray[i + 1] += velArray[i + 1]
          posArray[i + 2] += velArray[i + 2]

          if (Math.abs(posArray[i]) > 15) velArray[i] *= -1
          if (Math.abs(posArray[i + 1]) > 10) velArray[i + 1] *= -1
          if (Math.abs(posArray[i + 2]) > 7.5) velArray[i + 2] *= -1
        }

        positions.needsUpdate = true

        const materialOpacity = 0.3 + Math.sin(progress * Math.PI) * 0.3
        ;(particles.material as THREE.PointsMaterial).opacity = materialOpacity
      }

      // Animate geometries based on scroll progress
      geometries.forEach((mesh, i) => {
        mesh.rotation.x = time * 0.2 * (i + 1) * 0.3
        mesh.rotation.y = time * 0.15 * (i + 1) * 0.3
        mesh.position.x = (i - 1) * 6 - progress * 15
      })

      // Camera slight movement based on progress
      camera!.position.x = progress * -2
      camera!.position.y = Math.sin(progress * Math.PI * 2) * 0.3

      renderer.render(scene, camera)
      animationId = requestAnimationFrame(tick)
    }

    animationId = requestAnimationFrame(tick)
  }

  function dispose(): void {
    if (animationId) cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)

    if (particles) {
      particles.geometry.dispose()
      ;(particles.material as THREE.PointsMaterial).dispose()
    }

    geometries.forEach((mesh) => {
      mesh.geometry.dispose()
      ;(mesh.material as THREE.MeshBasicMaterial).dispose()
    })

    renderer?.dispose()

    renderer = null
    scene = null
    camera = null
    particles = null
    geometries = []
    animationId = null
  }

  onMounted(init)
  onUnmounted(dispose)

  return { dispose }
}
