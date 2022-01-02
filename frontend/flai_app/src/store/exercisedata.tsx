import { readonly, reactive } from 'vue'
import { random } from '../ressources/ts/random'
import RestApi from '../common/service/rest'
import signData, { Sign } from './signdata'

export interface Exercise {
  id: string
  name: string
  description: string
  signs: Sign[]
}

const exercises: Exercise[] = reactive([])

const progressStep: number = 10
export interface ExerciseSettings {
  id: string
  level1: number
  level2: number
  level3: number
  exerciseId: string
  sortSignsByOrder: boolean
}

const exerciseSettings: ExerciseSettings = reactive({
  id: '',
  level1: 10,
  level2: 20,
  level3: 30,
  exerciseId: '',
  sortSignsByOrder: true,
})

export interface ExerciseSettingsUser {
  exerciseId: string
  wordLength: number
  unlockedSigns: number
}

const exerciseSettingsUser: ExerciseSettingsUser = reactive({
  exerciseId: '',
  wordLength: 4,
  unlockedSigns: 4,
})

export interface ExerciseSession {
  startTime: number
  sessionDuration: number
  order: number
  signs: Sign[]
}

const exerciseSessions: ExerciseSession[] = reactive([])

const methods = {
  getExercises() {
    const exercise: Exercise = {
      id: '0',
      name: 'test',
      description: 'this is testdata',
      signs: signData.methods.createNewSigns(),
    }
    exercises.push(exercise)
    exerciseSettings.exerciseId = exercise.id
    exerciseSettingsUser.exerciseId = exercise.id
    console.log('exercises:', JSON.stringify(exercises))
  },
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    exerciseSettingsUser.wordLength = wordLength
  },
  increaseUnlockedSigns() {
    exerciseSettingsUser.unlockedSigns +=
      exerciseSettingsUser.unlockedSigns < 26 ? 1 : 0
  },
  decreaseUnlockedSigns() {
    exerciseSettingsUser.unlockedSigns -=
      exerciseSettingsUser.unlockedSigns > 0 ? 1 : 0
  },
  startNewExerciseSession() {
    const newSession: ExerciseSession = {
      startTime: Date.now(),
      sessionDuration: 0,
      order: 0,
      signs: [],
    }
    exerciseSessions.push(newSession)
    return exerciseSessions
  },
  generateWord() {
    /* weighted random algorithm adapted from https://stackoverflow.com/questions/1761626/weighted-random-numbers */
    const word: Sign[] = []
    if (exercises.length > 0) {
      //get sum of progress
      let maxProgress = 0
      for (let i = 0; i < exerciseSettingsUser.unlockedSigns; i++) {
        maxProgress += exercises[0].signs[i].progress
      }
      //get as many random numbers as signs in word
      const randomNumbers: number[] = []
      for (let i = 0; i < exerciseSettingsUser.wordLength; i++) {
        randomNumbers.push(random(0, maxProgress))
      }
      for (let index = exercises[0].signs.length; index > 0; index--) {
        const weight =
          exerciseSettings.level3 - exercises[0].signs[index].progress
        for (let r = 0; r < randomNumbers.length; r++) {
          if (randomNumbers[r] < weight) {
            word.push(exercises[0].signs[index])
          }
          randomNumbers[r] -= weight
        }
      }
    }
    console.log('word', word)
    return word
  },
  stopExercise(searchId: string) {
    //TODO: not necessary to stop a exercise right now, maybe in the future to track the times
  },
  increaseProgress(exerciseId: string, letter: string) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.name === letter
    )
    exercises[exerciseIndex].signs[signIndex].progress += progressStep
    console.log(
      'updatedSign',
      exercises[exerciseIndex].signs[signIndex].name,
      exercises[exerciseIndex].signs[signIndex].progress
    )
  },
  decreaseProgress(exerciseId: string, letter: string) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.name === letter
    )
    exercises[exerciseIndex].signs[signIndex].progress -= progressStep
    exercises[exerciseIndex].signs[signIndex].progress =
      exercises[exerciseIndex].signs[signIndex].progress > 0
        ? exercises[exerciseIndex].signs[signIndex].progress
        : 0
    console.log(
      'updatedSign',
      exercises[exerciseIndex].signs[signIndex].name,
      exercises[exerciseIndex].signs[signIndex].progress
    )
  },
  signAlreadySeen(letter: string) {
    let sign = exercises[0].signs.find((el: Sign) => el.name == letter)
    if (sign) {
      sign.alreadySeen = true
    }
  },
}

const actions = {
  async getAllExercises() {
    RestApi.JsonAction('get', 'exercise/all')
  },
}

const exerciseData = {
  exercises: readonly(exercises) as Exercise[],
  exerciseSettings: readonly(exerciseSettings) as ExerciseSettings,
  exerciseSettingsUser: readonly(exerciseSettingsUser) as ExerciseSettingsUser,
  exerciseSessions: readonly(exerciseSessions) as ExerciseSession[],
  methods,
  actions,
}

export default exerciseData
