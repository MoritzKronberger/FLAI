import { readonly, reactive } from 'vue'
import { weightedRandomIndex } from '../ressources/ts/random'
import { jsonAction } from '../common/service/rest'
import { errorMessage } from '../ressources/ts/methods'
import signData, { Sign } from './signdata'
import userData from './userdata'
import { networkMessage } from './index'

export interface Exercise {
  id: string
  name: string
  description: string
  signs: Sign[]
}

const exercises: Exercise[] = reactive([])

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
  start_time: string
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
  createSignsForExercises() {
    for (let i = 0; i < exercises.length; i++) {
      exercises[i].signs = signData.methods.createNewSigns()
    }
  },
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
  startNewExerciseSession(exerciseId: string, startTime: string) {
    let word = this.generateWord(exerciseId)
    const newSession: ExerciseSession = {
      start_time: startTime,
      session_duration: 0,
      order: 0,
      signs: word,
    }
    exerciseSessions.push(newSession)
    return exerciseSessions
  },
  generateWord(exerciseId: string) {
    const word: Sign[] = []
    if (exercises.length > 0) {
      let exercise = exercises.find((el) => el.id === exerciseId)
      if (exercise) {
        let signCopy = [...exercise.signs]
        for (let i = 0; i < exerciseSettingsUser.word_length; i++) {
          let weightArray = []
          /* TODO: reactive to generate words, where letters are only included once 
          for (let k = 0; k < exerciseSettingsUser.unlockedSigns - i; k++) { */
          for (let k = 0; k < exerciseSettingsUser.unlocked_signs; k++) {
            weightArray.push(signCopy[k].progress + 1)
          }
          let index = weightedRandomIndex(weightArray)
          word.push(signCopy[index])
          // TODO: reactivate to generate words, where letters are only included once : signCopy.splice(index, 1)
        }
      }
    }
    console.log('word', word)
    return word
  },
  changeExerciseSessionDuration(startTime: string, duration: number) {
    let session = exerciseSessions.find((el) => el.start_time === startTime)
    if (session) {
      session.session_duration = duration
      console.log('new duration', session)
    }
  },
  deleteExerciseSession(startTime: string) {
    console.log(exerciseSessions)
    let index = exerciseSessions.findIndex((el) => el.start_time === startTime)
    exerciseSessions.splice(index, 0)
    console.log(exerciseSessions)
  },
  changeProgress(exerciseId: string, signId: string, progress: number) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.id === signId
    )
    exercises[exerciseIndex].signs[signIndex].progress = progress
    if (
      exercises[exerciseIndex].signs[signIndex].progress >=
      exerciseSettings.level_3
    ) {
      exercises[exerciseIndex].signs[signIndex].level_3_reached = true
    } else {
      exercises[exerciseIndex].signs[signIndex].level_3_reached = false
    }
    console.log(
      'updatedSign',
      exercises[exerciseIndex].signs[signIndex].name,
      exercises[exerciseIndex].signs[signIndex].progress,
      exercises[exerciseIndex].signs[signIndex].level_3_reached
    )
  },
  signAlreadySeen(letter: string) {
    let sign = exercises[0].signs.find((el: Sign) => el.name == letter)
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
    if (jsonData?.status === 200) {
      for (let row of jsonData?.data.rows) {
        let exerciseCache: Exercise = {
          id: row.id,
          name: row.name,
          description: row.description,
          signs: await signData.actions.getFullSignForExercise(row.id),
        }
        exercises.push(exerciseCache)
      }
      console.log(exercises)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
  async getFullExerciseForUser(exerciseId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'exercise',
      data: {
        id: exerciseId, // id == exercise_id
        user_id: userData.user.id,
      },
    })
    if (jsonData?.status === 200) {
      const exerciseData = jsonData?.data.rows[0]

      // TODO: missing?: exerciseSettings.id
      //exerciseSettings.id = exerciseData.id
      // TODO: for props of... loop
      exerciseSettings.exercise_id = exerciseId
      exerciseSettings.level_1 = exerciseData.level_1
      exerciseSettings.level_2 = exerciseData.level_2
      exerciseSettings.level_3 = exerciseData.level_3
      exerciseSettings.sort_signs_by_order = exerciseData.sort_signs_by_order

      exerciseSettingsUser.word_length = exerciseData.word_length
      exerciseSettingsUser.unlocked_signs = exerciseData.unlocked_signs

      console.log(exercises, exerciseSettings)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
  async patchExerciseSettings(exerciseId: string, wordLength: number) {
    const jsonData = await jsonAction({
      method: 'patch',
      url: 'exercise-settings',
      data: {
        ids: {
          exercise_id: exerciseId,
          user_id: userData.user.id,
        },
        data: {
          //task_split: 0.7,
          word_length: wordLength,
        },
      },
    })
    console.log(jsonData)
    if (jsonData?.status === 200) {
      //if (wordLength <= exerciseSettingsUser.unlockedSigns)
      methods.changeExerciseSettingsWordLength(wordLength)
      console.log(exerciseSettingsUser.word_length)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
  /*async getTask() {
    jsonAction({
      method: 'get',
      url: 'task',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
      },
    })
  },*/
  async getActiveExerciseSession(exerciseId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'exercise-session',
      data: {
        exercise_id: exerciseId,
        user_id: userData.user.id,
      },
    })
    if (jsonData?.status === 200) {
      Object.assign(exerciseSessions, jsonData?.data.rows)
      console.log(exerciseSessions)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },
  async postNewExerciseSession(exerciseId: string) {
    const startTime = new Date(Date.now()).toISOString()
    const jsonData = await jsonAction({
      method: 'post',
      url: 'exercise-session',
      data: {
        exercise_id: exerciseId,
        user_id: userData.user.id,
        start_time: startTime,
      },
    })
    if (jsonData?.status === 200) {
      methods.startNewExerciseSession(exerciseId, startTime)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },
  async patchExerciseSession(
    exerciseId: string,
    exerciseSession: ExerciseSession,
    sessionDuration: number
  ) {
    const jsonData = await jsonAction({
      method: 'patch',
      url: 'exercise-session',
      data: {
        data: {
          session_duration: sessionDuration,
        },
        ids: {
          exercise_id: exerciseId,
          user_id: userData.user.id,
          start_time: exerciseSession.start_time,
        },
      },
    })
    if (jsonData?.status === 200) {
      methods.changeExerciseSessionDuration(
        exerciseSession.start_time,
        sessionDuration
      )
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },
  /*async deleteExerciseSession(
    exerciseId: string,
    exerciseSession: ExerciseSession
  ) {
    const jsonData = await jsonAction({
      method: 'delete',
      url: 'exercise-session',
      data: {
        exercise_id: exerciseId,
        user_id: userData.user.id,
        start_time: exerciseSession.startTime,
      },
    })
    if (jsonData?.status === 200 || jsonData?.status === 204) {
      methods.deleteExerciseSession(exerciseSession.startTime)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },*/
  /* eslint-enable */
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
