import { reactive, readonly } from 'vue'

export interface Session {
  start_time: number
  timer: number
}

const session: Session = reactive({
  start_time: 0,
  timer: 0,
})

const methods = {
  startTimer() {
    session.start_time = Date.now()
  },
  updateTimer() {
    session.timer = Date.now() - session.start_time
    return session.timer
  },
}

const sessiondata = {
  session: readonly(session) as Session,
  methods,
}

export default sessiondata
