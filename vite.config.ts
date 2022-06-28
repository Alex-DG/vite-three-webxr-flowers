import glsl from 'vite-plugin-glsl'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  preview: {
    https: true,
  },
  server: {
    https: true,
  },
  plugins: [glsl()],
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})
