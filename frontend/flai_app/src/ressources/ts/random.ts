//returns random number between two values
export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

//return weighted random index out of an array of weight
//offset is used if you have zeros in your weights
/* weighted random algorithm adapted from https://stackoverflow.com/questions/1761626/weighted-random-numbers */
export function weightedRandomIndex(weightArray: number[]) {
  const maxWeight = weightArray.reduce((a, b) => a + b)
  let rand = random(1, maxWeight)
  for (let index = 0; index < weightArray.length; index++) {
    if (rand <= weightArray[index]) {
      return index
    }
    rand -= weightArray[index]
  }
  return -1
}
