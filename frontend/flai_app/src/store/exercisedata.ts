import { readonly, reactive } from 'vue'
import { jsonAction } from '../common/service/rest'
import { errorMessage } from '../ressources/ts/methods'
import signData from './signdata'
import userData from './userdata'
import { networkMessage } from './index'
import moment from 'moment'
import { PostgresData } from '../ressources/ts/interfaces'

export interface Exercise {
  id: string
  name: string
  description: string
}

const exercises: Exercise[] = reactive([])

export interface ExerciseSettings {
  id: string
  level_1: number
  level_2: number
  level_3: number
  progress_add: number
  progress_sub: number
  exercise_id: string
  sort_signs_by_order: boolean
}

const exerciseSettings = reactive({
  id: '',
  level_1: 10,
  level_2: 20,
  level_3: 30,
  progress_add: 5,
  progress_sub: -5,
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
  word_length: 0,
  unlocked_signs: 0,
})

export interface ExerciseSession {
  start_time: string
  session_duration: string
  order: number
}

const exerciseSessions: ExerciseSession[] = reactive([])

const activeExerciseSession: ExerciseSession = reactive({
  start_time: '',
  session_duration: '',
  order: 1,
})

export interface Word {
  signs: string[]
}

const word: Word = {
  signs: reactive([]),
}

const methods = {
  changeExerciseSettingsWordLength(wordLength: number) {
    if (wordLength <= exerciseSettingsUser.unlocked_signs)
      exerciseSettingsUser.word_length = wordLength
  },
  increaseUnlockedSigns() {
    exerciseSettingsUser.unlocked_signs +=
      exerciseSettingsUser.unlocked_signs < 26 ? 1 : 0
  },
  startNewExerciseSession(exerciseId: string, startTime: string) {
    const newSession: ExerciseSession = {
      start_time: startTime,
      session_duration: '',
      order: 0,
    }
    exerciseSessions.push(newSession)
    Object.assign(activeExerciseSession, newSession)
  },
  changeExerciseSessionDuration(startTime: string, sessionDuration: string) {
    const session = exerciseSessions.find((el) => el.start_time === startTime)
    if (session) {
      session.session_duration = sessionDuration
    }
    activeExerciseSession.session_duration = sessionDuration
  },
  deleteExerciseSession(startTime: string) {
    const index = exerciseSessions.findIndex(
      (el) => el.start_time === startTime
    )
    exerciseSessions.splice(index, 0)
  },
  changeWord(newWord: string[]) {
    Object.assign(word.signs, newWord)
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
      const data = jsonData.data as PostgresData
      if (data.rows) {
        for (const row of data.rows) {
          const exerciseCache: Exercise = {
            id: row.id as string,
            name: row.name as string,
            description: row.description as string,
          }
          exercises.push(exerciseCache)
        }
        await signData.actions.getFullSignForExercise(
          exercises[0].id,
          exerciseSettingsUser.unlocked_signs
        )
      }
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
      const data = jsonData.data as PostgresData

      const exerciseData = data.rows?.[0]

      exerciseSettings.level_1 = exerciseData?.level_1 as number
      exerciseSettings.level_2 = exerciseData?.level_2 as number
      exerciseSettings.level_3 = exerciseData?.level_3 as number
      exerciseSettings.progress_add = exerciseData?.progress_add as number
      exerciseSettings.progress_sub = exerciseData?.progress_sub as number
      exerciseSettings.sort_signs_by_order =
        exerciseData?.sort_signs_by_order as boolean

      exerciseSettingsUser.word_length = exerciseData?.word_length as number
      exerciseSettingsUser.unlocked_signs =
        exerciseData?.unlocked_signs as number

      for (const exercise of exercises) {
        Object.assign(
          signData.signs,
          await signData.actions.getFullSignForExercise(
            exercise.id,
            exerciseSettingsUser.unlocked_signs
          )
        )
      }
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
  async patchExerciseSettings(
    exerciseId: string,
    wordLength?: number,
    unlockedSigns?: number
  ) {
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
          unlocked_signs: unlockedSigns,
        },
      },
    })
    if (jsonData?.status === 200) {
      if (wordLength) methods.changeExerciseSettingsWordLength(wordLength)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
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
      const data = jsonData.data as PostgresData
      Object.assign(exerciseSessions, data.rows)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
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
      await signData.actions.getFullSignForExercise(
        exerciseId,
        exerciseSettingsUser.unlocked_signs
      )
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
  },
  async patchExerciseSession(
    exerciseId: string,
    exerciseSession: ExerciseSession
  ) {
    const timeNow = new Date(Date.now()).getTime()
    const startTime = new Date(exerciseSession.start_time).getTime()
    const difference = timeNow - startTime
    const sessionDuration = moment(difference).utc().format('HH:mm:ss')
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
  },
  /* eslint-enable */
}

const exerciseData = {
  exercises: readonly(exercises) as Exercise[],
  exerciseSettings: readonly(exerciseSettings) as ExerciseSettings,
  exerciseSettingsUser: readonly(exerciseSettingsUser) as ExerciseSettingsUser,
  exerciseSessions: readonly(exerciseSessions) as ExerciseSession[],
  activeExerciseSession: readonly(activeExerciseSession) as ExerciseSession,
  word: readonly(word) as Word,
  methods,
  actions,
}

export default exerciseData
