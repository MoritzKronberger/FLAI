import { readonly, reactive } from 'vue'
import { random } from '../ressources/ts/random'
import { jsonAction } from '../common/service/rest'
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
  level1: 100,
  level2: 200,
  level3: 300,
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
      word.push(signData.signs[index])
    }
    console.log('word', word)
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
  /* eslint-disable */
  async getAllExercises() {
    jsonAction({ method: 'get', url: 'exercise/all', data: {} })
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
  /* eslint-enable */
}

const exerciseData = {
  exerciseSettings: readonly(exerciseSettings) as ExerciseSettings,
  exercises: readonly(exercises) as Exercise[],
  methods,
  actions,
}
export default exerciseData
