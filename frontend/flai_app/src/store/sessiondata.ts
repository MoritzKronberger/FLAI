import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'

export interface Session {
  token: string
  startTime: number
  timer: number
  menuItemLink: string
}

const session: Session = reactive({
  token: '',
  startTime: 0,
  timer: 0,
  menuItemLink: '#home',
})

const methods = {
  startTimer() {
    session.startTime = Date.now()
  },
  updateTimer() {
    session.timer = Date.now() - session.startTime
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
