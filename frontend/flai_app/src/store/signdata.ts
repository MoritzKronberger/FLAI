import { readonly, reactive } from 'vue'
import exerciseData from './exercisedata'
import signrecordings, { SignRecording } from './signrecordings'
import { jsonAction } from '../common/service/rest'
import { errorMessage } from '../ressources/ts/methods'
import { networkMessage } from './index'
import userData from './userdata'

export interface Sign {
  id: string
  name: string
  motion_category_id: string
  progress: number
  level_3_reached: boolean
  recordings: SignRecording[]
  intro_done: boolean
}

const signs: Sign[] = reactive([])

const methods = {
  createNewSigns() {
    signs.length = 0
    for (let i = 0; i < 26; i++) {
      const sign: Sign = {
        id: '' + i,
        name: String.fromCharCode(97 + i),
        motion_category_id: '',
        progress: 0,
        level_3_reached: false,
        recordings: [],
        intro_done: false,
      }
      sign.recordings = signrecordings.methods.createSignRecording(sign)
      signs.push(sign)
    }
    console.log('signs', signs)
    return signs
  },
}

const actions = {
  /* eslint-disable */
  async getFullSignForExercise(exerciseId: string, unlockedSigns: number) {
    console.log('id', exerciseId)
    const jsonData = await jsonAction({
      method: 'get',
      url: 'sign',
      data: { exercise_id: exerciseId },
    })
    if (jsonData?.status === 200) {
      let signs: Sign[] = []
      let count = 0
      for (let row of jsonData?.data.rows) {
        if (count < unlockedSigns) {
          let jsonProgress = await this.getProgress(exerciseId, row.id)
          jsonProgress =
            jsonProgress === undefined
              ? { progress: 0, level_3_reached: false, intro_done: false }
              : jsonProgress.rows[0]
          let sign: Sign = {
            id: row.id,
            name: row.name,
            motion_category_id: row.motion_category,
            progress: jsonProgress.progress,
            level_3_reached: jsonProgress.level_3_reached,
            recordings: await actions.getSignRecording(row.id),
            intro_done: jsonProgress.intro_done,
          }
          console.log('sign:', sign)
          signs.push(sign)
          count++
        }
      }
      return signs
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log('data', jsonData.data)
    return []
  },
  async getSignRecording(signId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'sign-recording/sign',
      data: { sign_id: signId },
    })
    if (jsonData?.status === 200) {
      return jsonData.data.rows
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data.rows)
  },
  /*async getSignRecordingForExercise(exerciseId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'sign-recording/sign/exercise',
      data: { exercise_id: exerciseId },
    })
    if (jsonData?.status === 200) {
      return jsonData.data
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },*/
  async getProgress(exerciseId: string, signId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'progress',
      data: {
        user_id: userData.user.id,
        sign_id: signId,
        exercise_id: exerciseId,
      },
    })
    if (jsonData?.status === 200) {
      console.log(jsonData.data)
      return jsonData.data
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },
  async patchProgress(
    exerciseId: string,
    signId: string,
    progress: number,
    intro_done?: boolean
  ) {
    const jsonData = await jsonAction({
      method: 'patch',
      url: 'progress',
      data: {
        data: {
          progress: progress,
          intro_done: intro_done,
        },
        ids: {
          user_id: userData.user.id,
          sign_id: signId,
          exercise_id: exerciseId,
        },
      },
    })
    if (jsonData?.status === 200) {
      exerciseData.methods.changeProgress(exerciseId, signId, progress)
      if (intro_done) exerciseData.methods.changeIntroDone(signId)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    let sign = exerciseData.exercises[0].signs.find((el) => el.id === signId)
    console.log(jsonData.data)
  },
  /* eslint-enable */
}

const signData = {
  signs: readonly(signs) as Sign[],
  methods,
  actions,
}

export default signData
