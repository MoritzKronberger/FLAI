import { readonly, reactive } from 'vue'
import signrecordings, { SignRecording } from './signrecordings'
import { jsonAction } from '../common/service/rest'

export interface Sign {
  id: string
  name: string
  progress: number
  recordings: SignRecording[]
}

const signs: Sign[] = reactive([])

const methods = {
  createNewSigns() {
    signs.length = 0
    for (let i = 0; i < 26; i++) {
      const sign: Sign = {
        id: '' + i,
        name: String.fromCharCode(97 + i),
        progress: 0,
        recordings: [],
      }
      sign.recordings = signrecordings.methods.createSignRecording(sign)
      signs.push(sign)
    }
    console.log('signs', signs)
  },
  updateProgress(letter: string, difference: number) {
    const index = signs.findIndex((el) => el.name === letter)
    signs[index].progress += difference
    signs[index].progress =
      signs[index].progress > 0 ? signs[index].progress : 0
    console.log('updatedSign', signs[index])
  },
}

const actions = {
  /* eslint-disable */
  async getFullSignForExercise() {
    jsonAction({
      method: 'get',
      url: 'sign',
      data: { exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6' },
    })
  },
  async getSignRecording() {
    jsonAction({
      method: 'get',
      url: 'sign-recording/sign',
      data: { sign_id: 'deb2570c-0b58-41a1-8819-142cd04dda15' },
    })
  },
  async getSignRecordingForExercise() {
    jsonAction({
      method: 'get',
      url: 'sign-recording/sign/exercise',
      data: { exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6' },
    })
  },
  async getProgress() {
    jsonAction({
      method: 'get',
      url: 'progress',
      data: {
        user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
        sign_id: '7c4c0b35-be22-4048-bf9a-2dff96772d6f',
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
      },
    })
  },
  async patchProgress() {
    jsonAction({
      method: 'patch',
      url: 'progress',
      data: {
        data: {
          progress: 42,
          level_3_reached: 1,
        },
        ids: {
          user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac',
          sign_id: '7c4c0b35-be22-4048-bf9a-2dff96772d6f',
          exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6',
        },
      },
    })
  },
  /* eslint-enable */
}

const signData = {
  signs: readonly(signs) as Sign[],
  methods,
  actions,
}

export default signData
