import { Sign } from '../../store/signdata'
import { computed } from 'vue'
import store from '../../store'

// Returns the semi random weighted distance of a sign to a given number
// The distance is depends on the following weights:
// - a random value between 0 and 1
// - the signs progress as a fraction of the level_3 value
// - the number of occurrences of the sign in the already existing word part
// - if a vocal would be following on a vocal or if a consonant would be following on a consonant
// The amount these weights factor into the distance can be adjusted via the weight-variables.
// The current weighting has the following goal:
// - The signs progress should have the highest priority, so that lesser learned signs appear more often.
// - The occurrence has a relatively high priority, so that a word always contains varied signs.
// - The phonetic score is weighted the lowest. Since the signs appear ordered by their occurrence in the
//   German language and because there are a lot less vocals than consonants, it is more important to show
//   users new signs instead of holding them back with old, already learned vocals, even if this means less
//   phonetic accuracy.
export function getWeightedDistance(
  randomNumber: number,
  sign: Sign,
  word: string
) {
  const progressWeight = 1
  const occurrenceWeight = 0.6
  const phonetWeight = 0.4
  const vocals = 'aeiou'

  const level3 = computed(() => store.exercisedata.exerciseSettings.level_3)

  const signRandom = Math.random()
  const occurrenceInWord = (word.match(new RegExp(sign.name, 'g')) || []).length
  const phoneticScore =
    vocals.includes(word[word.length - 1]) === vocals.includes(sign.name)
      ? 1
      : 0

  const weightedDistance =
    Math.abs(randomNumber - signRandom) +
    (sign.progress / level3.value) * progressWeight +
    occurrenceInWord * occurrenceWeight +
    (word.length > 0 ? phoneticScore * phonetWeight : 0)

  return weightedDistance
}
