import { shutdownXR } from './xr'

export const loadingVisible = (visible) => {
  const loading = document.querySelector('.loading')
  if (loading) {
    if (visible) {
      loading.style.opacity = '1'
    } else {
      loading.style.opacity = '0'
    }
  }
}

export const arOverlayVisible = (visible) => {
  const overlay = document.getElementById('ar-overlay')
  if (overlay) {
    if (visible) {
      overlay.style.opacity = '1'
    } else {
      overlay.style.opacity = '0'
    }
  }
}

export const handAnimationVisible = (visible) => {
  const hand = document.querySelector('.hand-wrapper')
  if (hand) {
    if (visible) {
      hand.style.opacity = '1'
    } else {
      hand.style.opacity = '0'
    }
  }
}
