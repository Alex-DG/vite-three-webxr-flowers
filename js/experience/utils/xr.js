import { handAnimationVisible, arOverlayVisible, loadingVisible } from './dom'

/*
 * Returns true if navigator has xr with 'immersive-ar' capabilities
 * Returns false otherwise.
 */
export const browserHasImmersiveArCompatibility = async () => {
  if (window.navigator.xr) {
    const isSupported = await navigator.xr.isSessionSupported('immersive-ar')
    console.info(
      `${
        isSupported
          ? '✅ Browser supports immersive-ar'
          : '❌ Browser does not support immersive-ar'
      }`
    )
    return isSupported
  }
  return false
}

export const displayInstructionMessage = () => {
  setTimeout(() => {
    arOverlayVisible(true)
    handAnimationVisible(true)

    setTimeout(() => {
      handAnimationVisible(false)
    }, 4000)
  }, 1000)
}

/*
 * Create and display message when no XR capabilities are found.
 */
export const displayUnsupportedBrowserMessage = () => {
  const details = document.getElementById('ar-details')
  if (details) {
    details.innerHTML = `
        😿 Your browser does not support WebXR<br></br>
        
        * If you are using Android, please try to open this app using the latest version of Chrome or Firefox.<br></br> 

        * If you are using iOS, please try the latest version of the WebXR Viewer available on the App Store.
    `
    loadingVisible(false)
  }
}

const setOnSessionEnd = (session, onSessionEnd) => {
  session.addEventListener('end', () => {
    session.hitTestSourceInitialized = false
    session.hitTestSource = null
    onSessionEnd()
  })
}

export const handleXRHitTest = (renderer, frame, callbacks) => {
  const {
    onHitTestResultReady,
    onHitTestResultEmpty,
    onSessionEnd,
    onSessionStart,
  } = callbacks

  const referenceSpace = renderer.xr.getReferenceSpace()
  const session = renderer.xr.getSession()

  let xrHitPoseMatrix = null

  if (session && !session.hitTestSourceRequested) {
    session.requestReferenceSpace('viewer').then((referenceSpace) => {
      if (session) {
        session
          .requestHitTestSource({ space: referenceSpace })
          .then((source) => {
            session.hitTestSource = source
            session.hitTestSourceRequested = true

            setOnSessionEnd(session, onSessionEnd)
            onSessionStart()

            displayInstructionMessage()
          })
      }
    })
  }

  if (session?.hitTestSource) {
    const hitTestResults = frame?.getHitTestResults(session?.hitTestSource)
    if (hitTestResults?.length) {
      const hit = hitTestResults[0]

      if (hit && hit !== null && referenceSpace) {
        const xrHitPose = hit.getPose(referenceSpace)

        if (xrHitPose) {
          xrHitPoseMatrix = xrHitPose.transform.matrix
          onHitTestResultReady(xrHitPoseMatrix)
        }
      }
    } else {
      onHitTestResultEmpty()
    }
  }
}

export const shutdownXR = async (renderer) => {
  const session = renderer.xr.getSession()
  if (session) {
    await session.end()
  }
}
