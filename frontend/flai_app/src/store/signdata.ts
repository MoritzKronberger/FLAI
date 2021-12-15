import { readonly, reactive } from 'vue'

export interface Sign {
  id: string
  name: string
  progress: number
}

const signs: Sign[] = reactive([])

const methods = {
  createNewSigns() {
    for (let i = 0; i < 26; i++) {
      const sign: Sign = {
        id: '' + i,
        name: String.fromCharCode(97 + i),
        progress: 0,
      }
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

export default { signs: readonly(signs), methods }
