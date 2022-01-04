import { readonly, reactive } from 'vue'
import { weightedRandomIndex } from '../ressources/ts/random'
import { jsonAction } from '../common/service/rest'
import signData, { Sign } from './signdata'

export interface Exercise {
  id: string
  name: string
  description: string
  signs: Sign[]
}

const exercises: Exercise[] = reactive([])

const progressStep = 10
export interface ExerciseSettings {
  id: string
  level_1: number
  level_2: number
  level_3: number
  exercise_id: string
  sort_signs_by_order: boolean
}

const exerciseSettings = reactive({
  id: '',
  level_1: 10,
  level_2: 20,
  level_3: 30,
  exercise_id: '',
  sort_signs_by_order: true,
})

export interface ExerciseSettingsUser {
  exercise_id: string
  word_length: number
  unlocked_signs: number
}

const exerciseSettingsUser: ExerciseSettingsUser = reactive({
  exercise_id: '',
  word_length: 4,
  unlocked_signs: 4,
})

exerciseSettingsUser.unlocked_signs

export interface ExerciseSession {
  start_time: number
  session_duration: number
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
    exerciseSettings.exercise_id = exercise.id
    exerciseSettingsUser.exercise_id = exercise.id
    console.log('exercises:', JSON.stringify(exercises))
  },
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    if (wordLength <= exerciseSettingsUser.unlocked_signs)
      exerciseSettingsUser.word_length = wordLength
  },
  increaseUnlockedSigns() {
    exerciseSettingsUser.unlocked_signs +=
      exerciseSettingsUser.unlocked_signs < 26 ? 1 : 0
  },
  decreaseUnlockedSigns() {
    if (exerciseSettingsUser.word_length < exerciseSettingsUser.unlocked_signs)
      exerciseSettingsUser.unlocked_signs -=
        exerciseSettingsUser.unlocked_signs > 0 ? 1 : 0
  },
  startNewExerciseSession() {
    const word = this.generateWord()
    const newSession: ExerciseSession = {
      start_time: Date.now(),
      session_duration: 0,
      order: 0,
      signs: word,
    }
    exerciseSessions.push(newSession)
    return exerciseSessions
  },
  generateWord() {
    const word: Sign[] = []
    if (exercises.length > 0) {
      const signCopy = [...exercises[0].signs]
      for (let i = 0; i < exerciseSettingsUser.word_length; i++) {
        //get sum of progress
        const weightArray = []
        for (let k = 0; k < exerciseSettingsUser.unlocked_signs - i; k++) {
          weightArray.push(signCopy[k].progress + 1)
        }
        const index = weightedRandomIndex(weightArray)
        word.push(signCopy[index])
        signCopy.splice(index, 1)
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
    const sign = exercises[0].signs.find((el: Sign) => el.name === letter)
    if (sign) {
      sign.intro_done = true
    }
  },
}

const actions = {
  async getAllExercises() {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'exercise/all',
      data: {},
    })
    console.log(jsonData)
  },

  async getFullExerciseForUser() {
    jsonAction({
      method: 'get',
      url: 'exercise',
      // id == exercise_id
      data: {
        id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
      },
    })
  },

  async patchExerciseSettings() {
    jsonAction({
      method: 'patch',
      url: 'exercise-settings',
      data: {
        ids: {
          exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
          user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
        },
        data: {
          task_split: 0.7,
          word_length: 5,
        },
      },
    })
  },

  async getTask() {
    jsonAction({
      method: 'get',
      url: 'task',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
      },
    })
  },
  async getActiveExerciseSession() {
    jsonAction({
      method: 'get',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
      },
    })
  },
  async postNewExerciseSession() {
    jsonAction({
      method: 'post',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '7600c936-7c07-4e4d-98ec-243612652ca3',
        start_time: '2021-12-31 13:12:00.595133+00',
      },
    })
  },
  async patchExerciseSession() {
    jsonAction({
      method: 'patch',
      url: 'exercise-session',
      data: {
        data: {
          session_duration: '00:50:00',
        },
        ids: {
          exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
          user_id: '7600c936-7c07-4e4d-98ec-243612652ca3',
          start_time: '2021-12-31 13:12:00.595133+00',
        },
      },
    })
  },
  async deleteExerciseSession() {
    jsonAction({
      method: 'delete',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        user_id: '7600c936-7c07-4e4d-98ec-243612652ca3',
        start_time: '2021-12-31 13:12:00.595133+00',
      },
    })
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
