import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js'

import {
  browserHasImmersiveArCompatibility,
  displayUnsupportedBrowserMessage,
  handleXRHitTest,
} from './utils/xr'
import { getRandomFloat } from './utils/math'

import modelSrc from '../../assets/models/sunflower-v1.glb'

const DRACO_DECODER_PATH =
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'

class Experience {
  constructor(options) {
    this.container = options.container
    this.scene = new THREE.Scene()
    this.isReady = false

    // Flowers
    this.flowers = []
    this.growthSpeed = []
    this.scales = []

    this.defaultSpeed = options.speed || 0.025
    this.defaultScalar = options.scale || 0

    // WebXR
    this.hitTestSource = null
    this.localSpace = null
    this.hitTestSourceInitialized = false

    this.start()
  }

  init() {
    this.bind()

    this.setLoader()
    this.setLight()
    this.setSizes()
    this.setCamera()
    this.setRenderer()
    this.setBox()
    this.setFlower()
    this.setMarker()
    this.setController()

    this.update()
  }

  bind() {
    this.onSelect = this.onSelect.bind(this)
  }

  //////////////////////////////////////////////////////////////////////////////

  onSceneReady() {
    // Hide Loading
    this.loading = document.querySelector('.loading')
    this.loading.style.opacity = '0'

    // Add AR Button
    this.setARButton()
  }

  onSelect() {
    if (this.marker?.visible) {
      const model = this.sunflower.clone()

      model.position.setFromMatrixPosition(this.marker.matrix)
      model.rotation.setFromRotationMatrix(this.marker.matrix)

      // Rotate the model randomly to give a bit of variation to the scene.
      model.rotation.y = Math.random() * (Math.PI * 2)
      model.visible = true

      this.flowers.push(model)
      this.growthSpeed.push(this.defaultScalar)
      this.scales.push({
        value: model.scale.clone(),
        maxScale: getRandomFloat(0.5, 0.7),
      })

      this.scene.add(model)
    }
  }

  onSessionEnd() {
    this.marker.visible = false

    this.scene.remove(...this.flowers)

    this.flowers = []
    this.growthSpeed = []
    this.scales = []

    this.renderer.clear()
    console.log('👋', 'Session ended')
  }

  onHitTestResultReady(hitPoseTransformed) {
    if (hitPoseTransformed) {
      this.marker.visible = true
      this.marker.matrix.fromArray(hitPoseTransformed)
    }
  }

  onHitTestResultEmpty() {
    this.marker.visible = false
  }

  //////////////////////////////////////////////////////////////////////////////

  setLoader() {
    this.loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(DRACO_DECODER_PATH)
    this.loader.setDRACOLoader(dracoLoader)
  }

  setLight() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(ambientLight)
  }

  setSizes() {
    this.sizes = {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight || window.innerHeight,
    }
  }

  setCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.1,
      100
    )
    this.scene.add(this.camera)
  }

  setRenderer() {
    // Create a new WebGL renderer and set the size + pixel ratio.
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(this.sizes.width, this.sizes.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.outputEncoding = THREE.sRGBEncoding

    // Enable XR functionality on the renderer.
    this.renderer.xr.enabled = true

    // Add it to the DOM.
    this.container.appendChild(this.renderer.domElement)
  }

  setARButton() {
    // Create the AR button element, configure our XR session, and append it to the DOM.
    this.arButton = ARButton.createButton(this.renderer, {
      requiredFeatures: ['hit-test'],
    })
    document.body.appendChild(this.arButton)
  }

  setBox() {
    const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 1)
    const boxMaterial = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 'hotpink',
    })
    this.box = new THREE.Mesh(boxGeometry, boxMaterial)
    this.box.position.z = -3

    this.scene.add(this.box)
  }

  setFlower() {
    this.loader.load(modelSrc, (gltf) => {
      this.sunflower = gltf.scene
      this.sunflower.scale.multiplyScalar(this.defaultScalar)

      // Update material
      this.sunflower.traverse((child) => {
        if (child.isMesh && child.name === 'Object_2') {
          // Sunflower mesh
          const material = child.material
          const map = material.map
          material.emissive = new THREE.Color('#FFFF00')
          material.emissiveIntensity = 0.8
          material.emissiveMap = map
          material.color.convertSRGBToLinear()
          map.encoding = THREE.sRGBEncoding
        }
      })
      this.isReady = true

      console.log('🌻', 'Experience initialized', {
        sunflower: this.sunflower,
      })

      this.onSceneReady()
    })
  }

  setMarker() {
    const planeMarkerMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.7,
    })
    const planeMarkerGeometry = new THREE.RingBufferGeometry(
      0.15,
      0.2,
      32
    ).rotateX(-Math.PI / 2)

    this.marker = new THREE.Mesh(planeMarkerGeometry, planeMarkerMaterial)
    this.marker.matrixAutoUpdate = false
    this.scene.add(this.marker)
  }

  setController() {
    this.controller = this.renderer.xr.getController(0)
    this.scene.add(this.controller)

    this.controller.addEventListener('select', this.onSelect)
  }

  //////////////////////////////////////////////////////////////////////////////

  // Check if browser supports WebXR with "immersive-ar".
  async start() {
    const immersiveArSupported = await browserHasImmersiveArCompatibility()
    immersiveArSupported ? this.init() : displayUnsupportedBrowserMessage()
  }

  rescaleSunflower(index) {
    const sunflower = this.flowers[index]

    if (sunflower) {
      let growthSpeed = this.growthSpeed[index]
      let scale = this.scales[index].value

      growthSpeed += this.defaultSpeed

      scale.x += growthSpeed
      scale.y += growthSpeed
      scale.z += growthSpeed

      const maxScale = this.scales[index].maxScale
      sunflower.scale.x = Math.min(maxScale, scale.x)
      sunflower.scale.y = Math.min(maxScale, scale.y)
      sunflower.scale.z = Math.min(maxScale, scale.z)
    }
  }

  updateFlowers() {
    for (let index = 0; index < this.flowers.length; index++) {
      this.rescaleSunflower(index)
    }
  }

  update() {
    const renderLoop = (_, frame) => {
      if (!this.isReady) return

      this.box.rotation.y += 0.01
      this.box.rotation.x += 0.01

      if (this.renderer.xr.isPresenting) {
        if (frame) {
          const callbacks = {
            onHitTestResultEmpty: () => this.onHitTestResultEmpty(),
            onSessionEnd: () => this.onSessionEnd(),
            onHitTestResultReady: (hitPoseTransformed) =>
              this.onHitTestResultReady(hitPoseTransformed),
          }

          handleXRHitTest(this.renderer, frame, callbacks)
        }
        this.updateFlowers()
      }
      this.renderer.render(this.scene, this.camera)
    }
    this.renderer.setAnimationLoop(renderLoop)
  }
}

export default Experience