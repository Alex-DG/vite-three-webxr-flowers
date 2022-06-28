export const getRandomFloat = (min, max, decimals = 5) => {
  const str = (Math.random() * (max - min) + min).toFixed(decimals)
  return parseFloat(str)
}
