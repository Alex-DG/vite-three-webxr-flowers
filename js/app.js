import '../styles/app.css'
import handSrc from '../assets/hand_holding_phone.png'

import Experience from './experience'

console.log('🎉', 'Project generated using vite-three-starter')
console.log(':: https://github.com/Alex-DG/vite-three-starter ::')

/**
 * WebXR
 */
document.querySelector('#app').innerHTML = `
 <div class="introduction">
   <h1>AR with WebXR</h1>
   <p id="ar-details">
    This is an experiment using augmented reality features with the WebXR Device API.<br></br>

    Upon entering AR, enjoy the sunflowers!
   </p>
 </div>

 <div class="loading">
    <h2>Loading 🌻</h2>
  </div>

  <div id="ar-overlay">
   <span class="xr-end-session-btn">&times;</span>

   <div class="hand-wrapper">
      <div  class="hand-animation">
        <img src=${handSrc} alt="hand-instruction"> 
      </div>
    
      <span>Look for a marker</span>
      <span>on the ground</span>
    </div>
  </div>

`

/**
 * Experience
 */
window.experience = new Experience({
  container: document.getElementById('experience'),
})
