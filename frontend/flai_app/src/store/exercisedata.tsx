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
  startTime: string
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
  createSignsForExercises() {
    for (let i = 0; i < exercises.length; i++) {
      exercises[i].signs = signData.methods.createNewSigns()
    }
  },
  //TODO: change methods to suit database
  changeExerciseSettingsWordLength(wordLength: number) {
    if (wordLength <= exerciseSettingsUser.unlockedSigns)
      exerciseSettingsUser.wordLength = wordLength
  },
  increaseUnlockedSigns() {
    exerciseSettingsUser.unlockedSigns +=
      exerciseSettingsUser.unlockedSigns < 26 ? 1 : 0
  },
  decreaseUnlockedSigns() {
    if (exerciseSettingsUser.wordLength < exerciseSettingsUser.unlockedSigns)
      exerciseSettingsUser.unlockedSigns -=
        exerciseSettingsUser.unlockedSigns > 0 ? 1 : 0
  },
  startNewExerciseSession(exerciseId: string) {
    let word = this.generateWord(exerciseId)
    const newSession: ExerciseSession = {
      startTime: new Date(Date.now()).toISOString(),
      sessionDuration: 0,
      order: 0,
      signs: word,
    }
    exerciseSessions.push(newSession)
    return exerciseSessions
  },
  generateWord(exerciseId: string) {
    const word: Sign[] = []
    if (exercises.length > 0) {
      let signCopy = [...exercises[exerciseId].signs]
      for (let i = 0; i < exerciseSettingsUser.wordLength; i++) {
        //get sum of progress
        let weightArray = []
        for (let k = 0; k < exerciseSettingsUser.unlockedSigns - i; k++) {
          weightArray.push(signCopy[k].progress + 1)
        }
        let index = weightedRandomIndex(weightArray)
        word.push(signCopy[index])
        signCopy.splice(index, 1)
      }
    }
    console.log('word', word)
    return word
  },
  changeExerciseSessionDuration(startTime: string, duration: number) {
    let session = exerciseSessions.find((el) => el.startTime === startTime)
    if (session) {
      session.sessionDuration = duration
      console.log('new duration', session)
    }
  },
  deleteExerciseSession(startTime: string) {
    let index = exerciseSessions.findIndex((el) => el.startTime === startTime)
    exerciseSessions.splice(index, 0)
  },
  stopExerciseSession(searchId: string) {
    //TODO: not necessary to stop a exercise right now, maybe in the future to track the times
  },
  increaseProgress(exerciseId: string, letter: string) {
    const exerciseIndex = exercises.findIndex((el) => el.id === exerciseId)
    const signIndex = exercises[exerciseIndex].signs.findIndex(
      (el) => el.name === letter
    )
    exercises[exerciseIndex].signs[signIndex].progress += progressStep
    if (
      exercises[exerciseIndex].signs[signIndex].progress >=
      exerciseSettings.level3
    ) {
      exercises[exerciseIndex].signs[signIndex].level3Reached = true
    }
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
    if (
      exercises[exerciseIndex].signs[signIndex].progress <
      exerciseSettings.level3
    ) {
      exercises[exerciseIndex].signs[signIndex].level3Reached = false
    }
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
  /* eslint-disable */
  async getAllExercises() {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'exercise/all',
      data: {},
    })
    if (jsonData?.status === 200) {
      Object.assign(exercises, jsonData?.data.rows)
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
      exerciseSettings.exerciseId = exerciseId
      exerciseSettings.level1 = exerciseData.level_1
      exerciseSettings.level2 = exerciseData.level_2
      exerciseSettings.level3 = exerciseData.level_3
      exerciseSettings.sortSignsByOrder = exerciseData.sort_signs_by_order

      exerciseSettingsUser.wordLength = exerciseData.word_length
      exerciseSettingsUser.unlockedSigns = exerciseData.unlocked_signs
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
      if (wordLength <= exerciseSettingsUser.unlockedSigns) {
        methods.changeExerciseSettingsWordLength(wordLength)
      }
      console.log(exerciseSettingsUser.wordLength)
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
      //TODO: does overwriting sessions make sense?
      Object.assign(exerciseSessions, jsonData?.data.rows)
      console.log(exerciseSessions)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },

  // TODO: actions down are not working
  async postNewExerciseSession(exerciseId: string) {
    const jsonData = await jsonAction({
      method: 'post',
      url: 'exercise-session',
      data: {
        exercise_id: exerciseId,
        user_id: userData.user.id,
        start_time: new Date(Date.now()).toISOString(),
      },
    })
    if (jsonData?.status === 200) {
      console.log(jsonData.data)
      methods.startNewExerciseSession(exerciseId)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
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
          start_time: exerciseSession.startTime,
        },
      },
    })
    if (jsonData?.status === 200) {
      methods.changeExerciseSessionDuration(
        exerciseSession.startTime,
        sessionDuration
      )
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
  async deleteExerciseSession(
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
    // TODO: check for status code
    if (jsonData?.status === 200 || jsonData?.status === 204) {
      methods.deleteExerciseSession(exerciseSession.startTime)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
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
