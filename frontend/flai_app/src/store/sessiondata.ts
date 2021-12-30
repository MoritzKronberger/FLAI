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

const actions = {
  async getActiveExerciseSession() {
    jsonAction({
      method: 'get',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6', // eslint-disable-line
        user_id: '079c8725-3b47-434c-ba1a-afe3a8162dac', // eslint-disable-line
      },
    })
  },
  async postNewExerciseSession() {
    jsonAction({
      method: 'post',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6', // eslint-disable-line
        user_id: '7600c936-7c07-4e4d-98ec-243612652ca3', // eslint-disable-line
        start_time: '2021-12-27 13:12:00.595133+00', // eslint-disable-line
      },
    })
  },
  async patchExerciseSession() {
    jsonAction({
      method: 'patch',
      url: 'exercise-session',
      data: {
        data: {
          session_duration: '00:50:00', // eslint-disable-line
        },
        ids: {
          exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6', // eslint-disable-line
          user_id: '7600c936-7c07-4e4d-98ec-243612652ca3', // eslint-disable-line
          start_time: '2021-12-27 13:11:00.595133+00', // eslint-disable-line
        },
      },
    })
  },
  async deleteExerciseSession() {
    jsonAction({
      method: 'delete',
      url: 'exercise-session',
      data: {
        exercise_id: '81cb9652-c202-4675-a55d-81296b7d17b6', // eslint-disable-line
        user_id: '7600c936-7c07-4e4d-98ec-243612652ca3', // eslint-disable-line
        start_time: '2021-12-27 13:12:00.595133+00', // eslint-disable-line
      },
    })
  },
}

const sessiondata = {
  session: readonly(session) as Session,
  methods,
}

export default { sessiondata, actions }
