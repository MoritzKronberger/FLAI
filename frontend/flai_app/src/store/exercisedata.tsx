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
    exercises[0].signs[exerciseSettingsUser.unlockedSigns].isUnlocked = true
    exerciseSettingsUser.unlockedSigns +=
      exerciseSettingsUser.unlockedSigns < 26 ? 1 : 0
  },
  decreaseUnlockedSigns() {
    exercises[0].signs[exerciseSettingsUser.unlockedSigns - 1].isUnlocked =
      false
    exerciseSettingsUser.unlockedSigns -=
      exerciseSettingsUser.unlockedSigns > 0 ? 1 : 0
  },
  startNewExerciseSession() {
    const word: Sign[] = []
    if (exercises.length > 0) {
      for (let i = 0; i < exerciseSettingsUser.wordLength; i++) {
        const index = random(0, exerciseSettingsUser.unlockedSigns)
        console.log('letter in word?', exercises[0].signs[index])
        if (exercises[0].signs[index].progress >= exerciseSettings.level3) {
          console.log('BIGGER LEVEL 3')
          const fiftyFiftyChance = random(0, 10)
          console.log('fiftyfifty', fiftyFiftyChance)
          if (fiftyFiftyChance >= 5) {
            word.push(exercises[0].signs[index])
          } else {
            i--
          }
        } else {
          word.push(exercises[0].signs[index])
        }
      }
    }

    console.log('word', word)
    const newSession: ExerciseSession = {
      startTime: Date.now(),
      sessionDuration: 0,
      order: 0,
      signs: word,
    }
    exerciseSessions.push(newSession)
    return exerciseSessions
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
