import { onMounted, onUnmounted, type Ref } from 'vue'
import * as THREE from 'three'

interface RealisticThreeOptions {
  particleCount?: number
  particleColor?: number
}

export function useRealisticThreeScene(
  canvasRef: Ref<HTMLCanvasElement | null>,
  scrollProgress: Ref<number>,
  options: RealisticThreeOptions = {},
): { dispose: () => void } {
  const { particleCount = 2000, particleColor = 0x00ff88 } = options

  let renderer: THREE.WebGLRenderer | null = null
  let scene: THREE.Scene | null = null
  let camera: THREE.PerspectiveCamera | null = null
  let particles: THREE.Points | null = null
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
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05)

    camera = new THREE.PerspectiveCamera(
      60,
      canvasRef.value.clientWidth / canvasRef.value.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 10
    camera.position.y = 2

    createAdvancedParticles()

    window.addEventListener('resize', handleResize)
    startLoop()
  }

  function createAdvancedParticles(): void {
    if (!scene) return

    const geometry = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3
      // Create a cinematic scattered particle field
      const radius = 25
      const theta = Math.random() * 2 * Math.PI
      const phi = Math.acos(Math.random() * 2 - 1)
      
      const r = Math.cbrt(Math.random()) * radius
      
      positions[i3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i3 + 2] = r * Math.cos(phi)

      sizes[i] = Math.random() * 2.0
      phases[i] = Math.random() * Math.PI * 2
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

    // Use a custom realistic shader material for glowing bokeh particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(particleColor) },
        time: { value: 0 },
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute float phase;
        varying float vAlpha;
        void main() {
          vec3 pos = position;
          // Subtle drifting
          pos.y += sin(time * 0.5 + phase) * 0.5;
          pos.x += cos(time * 0.3 + phase) * 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (30.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          vAlpha = 0.3 + 0.7 * sin(time + phase);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          float dist = distance(gl_PointCoord, vec2(0.5));
          if (dist > 0.5) discard;
          // Soft radial glow
          float alpha = (0.5 - dist) * 2.0 * vAlpha * 0.8;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    particles = new THREE.Points(geometry, material)
    scene.add(particles)
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
    const clock = new THREE.Clock()

    function tick(): void {
      if (!renderer || !scene || !camera) return
      
      const elapsedTime = clock.getElapsedTime()
      const mixProgress = scrollProgress.value

      if (particles) {
        (particles.material as THREE.ShaderMaterial).uniforms.time.value = elapsedTime
        particles.rotation.y = elapsedTime * 0.05 + mixProgress * 0.5
        particles.rotation.x = mixProgress * 0.2
      }

      // Parallax effect with scroll
      camera.position.y = 2 - mixProgress * 5
      camera.lookAt(scene.position)

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
      ;(particles.material as THREE.ShaderMaterial).dispose()
    }

    renderer?.dispose()

    renderer = null
    scene = null
    camera = null
    particles = null
    animationId = null
  }

  onMounted(() => {
    // Wait for DOM
    setTimeout(init, 0)
  })
  
  onUnmounted(dispose)

  return { dispose }
}
