import '../styles/app.css'

import Experience from './experience'

console.log('🎉', 'Project generated using vite-three-starter')
console.log(':: https://github.com/Alex-DG/vite-three-starter ::')

/**
 * WebXR
 */
document.querySelector('#app').innerHTML = `
 <div class="container">
   <h1>AR with WebXR</h1>
   <p id="ar-details">
    This is an experiment using augmented reality features with the WebXR Device API.<br></br>

    Upon entering AR, enjoy the sunflowers!
   </p>
 </div>

 <div class="loading">
    <h2>Loading 🌻</h2>
  </div>
`

/**
 * Experience
 */
window.experience = new Experience({
  container: document.getElementById('experience'),
})
