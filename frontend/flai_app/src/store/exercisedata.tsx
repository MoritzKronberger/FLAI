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
    const word: Sign[] = []
    for (let i = 0; i < exerciseSettingsUser.wordLength; i++) {
      const index = random(0, exerciseSettingsUser.unlockedSigns)
      word.push(signData.signs[index])
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
  updateProgress(exerciseId: string, letter: string, difference: number) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.name === letter
    )
    exercises[exerciseIndex].signs[signIndex].progress += difference
    exercises[exerciseIndex].signs[signIndex].progress =
      exercises[exerciseIndex].signs[signIndex].progress > 0
        ? exercises[exerciseIndex].signs[signIndex].progress
        : 0
    console.log(
      'updatedSign',
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
