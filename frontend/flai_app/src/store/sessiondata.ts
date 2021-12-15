import { reactive, readonly } from 'vue'

export interface Session {
  token: string
  startTime: number
  timer: number
}

const session: Session = reactive({
  token: '',
  startTime: 0,
  timer: 0,
})

const methods = {
  startTimer() {
    session.startTime = Date.now()
  },
  updateTimer() {
    session.timer = Date.now() - session.startTime
  },
}

export default { session: readonly(session), methods }
