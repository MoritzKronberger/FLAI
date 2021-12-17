import { readonly, reactive } from 'vue'
import signrecordings, { SignRecording } from './signrecordings'

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
    console.log('updatedSign', signs[index])
  },
}

const signData = { signs: readonly(signs), methods }

export default signData
