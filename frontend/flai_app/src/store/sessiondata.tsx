import { reactive, readonly } from 'vue'

export interface Session {
  start_time: number
  timer: number
  menuItemLink: string
}

const session: Session = reactive({
  start_time: 0,
  timer: 0,
  menuItemLink: '#home',
})

const methods = {
  startTimer() {
    session.start_time = Date.now()
  },
  updateTimer() {
    session.timer = Date.now() - session.start_time
  },
  updateMenuItemLink(link: string) {
    return (session.menuItemLink = link)
  },
}

const sessiondata = {
  session: readonly(session) as Session,
  methods,
}

export default sessiondata
