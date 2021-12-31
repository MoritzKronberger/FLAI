import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'

export interface User {
  id: string //uuid
  email: string
  username: string
  rightHanded: boolean
  targetLearningTime: number
}

const user: User = reactive({
  id: '',
  email: '',
  username: '',
  rightHanded: true,
  targetLearningTime: 10 * 60 * 1000, //millisec
})

const methods = {
  changeEmail(email: string) {
    user.email = email
  },
  changeUsername(username: string) {
    user.username = username
  },
  changeRightHanded(rightHanded: boolean) {
    user.rightHanded = rightHanded
  },
  changeTargetLearningTime(minutes: number) {
    user.targetLearningTime = minutes * 60 * 1000
  },
}

const actions = {
  /* eslint-disable */
  async getUser() {
    jsonAction({
      method: 'get',
      url: 'user',
      data: { id: '079c8725-3b47-434c-ba1a-afe3a8162dac' },
    })
  },

  async postNewUser() {
    jsonAction({
      method: 'post',
      url: 'user',
      data: {
        username: 'martin',
        password: 'testmk1',
        email: 'martin.kohnle@flai-team.de',
      },
    })
  },
  async patchUser() {
    jsonAction({
      method: 'patch',
      url: 'user',
      data: {
        data: {
          username: 'marti',
        },
        ids: {
          id: '25cb10b9-baee-455b-9c22-fca251b324f5',
        },
      },
    })
  },
  async deleteUser() {
    jsonAction({
      method: 'delete',
      url: 'user',
      data: {
        id: '25cb10b9-baee-455b-9c22-fca251b324f5',
      },
    })
  },
  /* eslint-enable */
}

const userData = {
  user: readonly(user) as User,
  methods,
  actions,
}

export default userData
