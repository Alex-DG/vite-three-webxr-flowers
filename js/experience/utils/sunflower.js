import { getRandomSpherePoint } from './math'

export const createSunflower = (model, matrix) => {
  const sunflower = model.clone()
  const { position, rotation } = sunflower
  position.setFromMatrixPosition(matrix)
  rotation.setFromRotationMatrix(matrix)

  /**
   * Randomly rotate and define a position to give a bit of variation to the scene.
   */
  // Position
  const randomPosition = getRandomSpherePoint(position, 1 / 4)
  sunflower.position.copy(randomPosition)
  // Rotate
  sunflower.rotation.y = Math.random() * (Math.PI * 2)
  sunflower.visible = true

  return sunflower
}
