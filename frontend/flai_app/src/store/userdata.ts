import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import authData from './authdata'
export interface User {
  id: string
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

const actions = {
  async getUser() {
    user.id = authData.methods.fetchUserId()
    const jsonData = await jsonAction({
      method: 'get',
      url: 'user',
      data: { id: user.id },
    })
    const data = jsonData?.data.rows[0] as User
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
  async patchUser(patch: object) {
    const jsonData = await jsonAction({
      method: 'patch',
      url: 'user',
      data: {
        data: patch,
        ids: {
          id: user.id,
        },
      },
    })
    if (jsonData?.status === 200) {
      this.getUser()
    }
    return jsonData
  },
  async deleteUser() {
    jsonAction({
      method: 'delete',
      url: 'user',
      data: {
        id: user.id,
      },
    })
  },
}

const methods = {
  changeEmail(email: string) {
    user.email = email
    actions.patchUser({ email: email })
  },
  changeUsername(username: string) {
    user.username = username
    actions.patchUser({ username: username })
  },
  changeRightHanded(rightHanded: boolean) {
    user.rightHanded = rightHanded
    actions.patchUser({ right_handed: rightHanded }) // eslint-disable-line
  },
  changeTargetLearningTime(minutes: number) {
    user.targetLearningTime = minutes * 60 * 1000
    actions.patchUser({ targetLearningTime: minutes })
  },
}

const userData = {
  user: readonly(user) as User,
  methods,
  actions,
}

export default userData
