import { readonly, reactive } from 'vue'
import signrecordings, { SignRecording } from './signrecordings'

export interface Sign {
  id: string
  name: string
  motionCategoryId: string
  progress: number
  level3Reached: boolean
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
        motionCategoryId: '',
        progress: 0,
        level3Reached: false,
        recordings: [],
      }
      sign.recordings = signrecordings.methods.createSignRecording(sign)
      signs.push(sign)
    }
    console.log('signs', signs)
    return signs
  },
}

const signData = {
  signs: readonly(signs) as Sign[],
  methods,
}

export default signData
