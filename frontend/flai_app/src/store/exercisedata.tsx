import { readonly, reactive } from 'vue'
import { random } from '../ressources/ts/random'
import RestApi from '../common/service/rest'
import signData, { Sign } from './signdata'

export interface ExerciseSettings {
  id: string
  level1: number
  level2: number
  level3: number
  wordLength: number
  unlockedSigns: number
}

const exerciseSettings: ExerciseSettings = reactive({
  id: '',
  level1: 10,
  level2: 20,
  level3: 30,
  wordLength: 4,
  unlockedSigns: 4,
})

export interface Exercise {
  id: string
  name: string
  description: string
  firstStart: number
  sessionDuration: number
  signs: Sign[]
}

const exercises: Exercise[] = reactive([])

const methods = {
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    exerciseSettings.wordLength = wordLength
  },
  increaseUnlockedSigns() {
    exerciseSettings.unlockedSigns +=
      exerciseSettings.unlockedSigns < 26 ? 1 : 0
  },
  decreaseUnlockedSigns() {
    exerciseSettings.unlockedSigns -= exerciseSettings.unlockedSigns > 0 ? 1 : 0
  },
  startNewExercise(name: string, description: string) {
    const word: Sign[] = []
    for (let i = 0; i < exerciseSettings.wordLength; i++) {
      const index = random(0, exerciseSettings.unlockedSigns)
      console.log('letter', signData.signs[index])
      word.push(signData.signs[index])
    }
    console.log('word after start', word)
    const exercise: Exercise = {
      id: '' + exercises.length,
      name: name,
      description: description,
      firstStart: Date.now(),
      sessionDuration: 0,
      signs: word,
    }
    exercises.push(exercise)
    console.log('exerciseId', exercise.id)
    return exercise.id
  },
  stopExercise(searchId: string) {
    const index = exercises.findIndex((el) => el.id === searchId)
    exercises[index].sessionDuration = Date.now() - exercises[index].firstStart
    console.log(exercises[index])
  },
}

const actions = {
  async getAllExercises() {
    RestApi.JsonAction('get', 'exercise/all')
  },
}

const exerciseData = {
  exerciseSettings: readonly(exerciseSettings) as ExerciseSettings,
  exercises: readonly(exercises) as Exercise[],
  methods,
}
export default { exerciseData, actions }
