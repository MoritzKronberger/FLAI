import { Sign } from '../../store/signdata'
import levenshtein from 'fast-levenshtein'
import { computed } from 'vue'
import store from '../../store'

// returns a semi random weighted distance of a sign to a given number
// the distance is depends on the following weights:
// - a random value between 0 and 1
// - the signs progress as a fraction of the level_3 value
// - the levenshtein distance of the letter to the current word (the higher the distance, the less the letter appears in the word)
//   (levenshtein could probably be raplaced with a simpler function)
// the amount these weigths factor into the distance can be adjusted via the ...Weight variables
// In the end the sign with the smallest distance value should be aded to the word.
export function getWeightedDistance(
  randomNumber: number,
  sign: Sign,
  word: string
) {
  const progressWeight = 1.2
  const matchesWordWeight = 1
  const epsilon = 0.01

  const level3 = computed(() => store.exercisedata.exerciseSettings.level_3)

  const signRandom = Math.random()
  const matchesWord = levenshtein.get(word, sign.name)

  const weightedDistance =
    (Math.abs(randomNumber - signRandom) +
      (sign.progress * progressWeight) / level3.value) /
    (Math.max(matchesWord, epsilon) / matchesWordWeight)

  return weightedDistance
}
