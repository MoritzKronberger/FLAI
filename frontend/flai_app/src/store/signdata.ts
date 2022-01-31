import { readonly, reactive } from 'vue'
import exerciseData from './exercisedata'
import { SignRecording } from './signrecordings'
import { jsonAction } from '../common/service/rest'
import { errorMessage } from '../ressources/ts/methods'
import { networkMessage } from './index'
import userData from './userdata'
import { getWeightedDistance } from '../ressources/ts/random'
import { PostgresData } from '../ressources/ts/interfaces'

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
  /*createNewSigns() {
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
  },*/

  generateWord(): string[] {
    interface Word {
      signIds: string[]
      letters: string
    }
    const word: Word = { signIds: [], letters: '' }
    const signCopy = [...signs]
    const randomNumber = Math.random()

    console.log('The word is:')
    for (let i = 0; i < exerciseData.exerciseSettingsUser.word_length; i++) {
      // compute weightedDistances for all sign candidates
      const weightArray = []
      for (
        let k = 0;
        k < exerciseData.exerciseSettingsUser.unlocked_signs;
        k++
      ) {
        const weightedDistance = getWeightedDistance(
          randomNumber,
          signCopy[k],
          word.letters
        )
        weightArray.push(weightedDistance)
      }
      // select sign with smallest weighted distance value
      const index = weightArray.indexOf(Math.min(...weightArray))
      word.signIds.push(signCopy[index].id)
      word.letters = word.letters + signCopy[index].name
      console.log(
        `letter ${i}: ${signCopy[index].name} (progress: ${signCopy[index].progress})`
      )
    }
    return word.signIds
  },
  changeProgress(exerciseId: string, signId: string, progress: number) {
    const signIndex = signs.findIndex((el) => el.id === signId)
    signs[signIndex].progress = progress
    console.log(
      'updatedSign',
      signs[signIndex].name,
      signs[signIndex].progress,
      'level3:',
      signs[signIndex].level_3_reached,
      'intro_done',
      signs[signIndex].intro_done
    )
  },
  changeIntroDone(signId: string) {
    const sign = signs.find((el: Sign) => el.id === signId)
    if (sign) {
      sign.intro_done = true
    }
    console.log('introdone', sign?.name, sign?.intro_done)
  },
}

const actions = {
  async getFullSignForExercise(exerciseId: string, unlockedSigns: number) {
    console.log('id', exerciseId)
    const jsonData = await jsonAction({
      method: 'get',
      url: 'sign',
      data: { exercise_id: exerciseId },
    })
    const data = jsonData.data as PostgresData
    if (jsonData?.status === 200 && data.rows) {
      const signArray: Sign[] = []
      let count = 0
      for (const row of data.rows) {
        if (count < unlockedSigns) {
          const jsonProgress = await this.getProgress(
            exerciseId,
            row.id as string
          )
          const signProgress =
            jsonProgress === undefined || !jsonProgress.rows
              ? { progress: 0, level_3_reached: false, intro_done: false }
              : jsonProgress.rows[0]
          const signRecording = await actions.getSignRecording(row.id as string)
          const sign: Sign = {
            id: row.id as string,
            name: row.name as string,
            motion_category_id: row.motion_category as string,
            progress: signProgress.progress as number,
            level_3_reached: signProgress.level_3_reached as boolean,
            recordings: [],
            intro_done: signProgress.intro_done as boolean,
          }
          Object.assign(sign.recordings, signRecording)
          console.log('sign:', sign)
          signArray.push(sign)
          count++
        }
      }
      Object.assign(signs, signArray)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log('data', jsonData.data)
  },
  async getSignRecording(signId: string) {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'sign-recording/sign',
      data: { sign_id: signId },
    })
    if (jsonData?.status === 200) {
      console.log((jsonData.data as PostgresData).rows)
      return (jsonData.data as PostgresData).rows
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
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
      return jsonData.data as PostgresData
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log('getProgress', jsonData.data)
  },
  async patchProgress(
    exerciseId: string,
    signId: string,
    progress: number,
    introDone?: boolean
  ) {
    progress = progress > 0 ? progress : 0
    const jsonData = await jsonAction({
      method: 'patch',
      url: 'progress',
      data: {
        data: {
          progress: progress,
          intro_done: introDone,
        },
        ids: {
          user_id: userData.user.id,
          sign_id: signId,
          exercise_id: exerciseId,
        },
      },
    })
    if (jsonData?.status === 200) {
      methods.changeProgress(exerciseId, signId, progress)
      if (introDone) methods.changeIntroDone(signId)
    } else if (jsonData?.status === 503) {
      errorMessage(networkMessage)
    }
    console.log(jsonData.data)
  },
}

const signData = {
  signs: readonly(signs) as Sign[],
  methods,
  actions,
}

export default signData
