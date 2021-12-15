import { reactive, readonly } from 'vue'

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

const methods = {
  changeEmail(email: string) {
    user.email = email
  },
  changeUsername(username: string) {
    user.username = username
  },
  startTimer() {
    sessiondata.startTime = Date.now()
  },
  updateTimer() {
    sessiondata.timer = Date.now() - sessiondata.startTime
  },
}

export default {
  user: readonly(user),
  sessiondata: readonly(sessiondata),
  methods,
}
