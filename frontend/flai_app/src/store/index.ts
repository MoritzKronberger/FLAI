import { readonly } from 'vue'
import userdata from './userdata'
import sessiondata from './sessiondata'
import signrecordings from './signrecordings'
export interface Sign {
  id: string
  name: string
  progress: number
}

const signs: Sign[] = []

const methods = {}

export default {
  userdata,
  sessiondata,
  signrecordings,
  signs: readonly(signs),
  methods,
}
