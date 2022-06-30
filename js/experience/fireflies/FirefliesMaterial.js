import { ShaderMaterial, AdditiveBlending } from 'three'

import vertexShader from '../shader/fireflies/vertex.glsl'
import fragmentShader from '../shader/fireflies/fragment.glsl'

class FirefliesMaterial extends ShaderMaterial {
  constructor() {
    super({
      transparent: true,
      blending: AdditiveBlending,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
        uSize: { value: 100 },
      },
      vertexShader,
      fragmentShader,
    })
  }

  get time() {
    return this.uniforms.uTime.value
  }

  set time(value) {
    this.uniforms.uTime.value = value
  }
}

export default FirefliesMaterial
