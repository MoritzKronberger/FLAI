import { reactive } from 'vue'

export interface User {
  id: string //uuid
  email: string
  username: string
}

const user: User = reactive({
  id: '',
  email: '',
  username: '',
})

export interface Sessiondata {
  token: string
  startTime: number
  timer: number
}

const sessiondata: Sessiondata = reactive({
  token: '',
  startTime: 0,
  timer: 0,
})

export default { user, sessiondata }
