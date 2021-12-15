import { reactive, readonly } from 'vue'

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
  startTimer() {
    sessiondata.startTime = Date.now()
  },
  updateTimer() {
    sessiondata.timer = Date.now() - sessiondata.startTime
  },
}

export default { sessiondata: readonly(sessiondata), methods }
