import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import authdata from './authdata'

export interface User {
  id: string //uuid
  email: string
  username: string
  right_handed: boolean
  target_learning_time: number
}

export interface RegisterUser {
  username: string
  email: string
  password: string
  /* eslint-disable */
  right_handed: boolean
  /* eslint-enable */
}

const user: User = reactive({
  id: '',
  email: '',
  username: '',
  right_handed: true,
  target_learning_time: 10 * 60 * 1000, //millisec
})

const actions = {
  /* eslint-disable */
  async getUser() {
    user.id = authdata.methods.fetchUserId()
    const jsonData = await jsonAction({
      method: 'get',
      url: 'user',
      data: { id: user.id },
    })
    console.log(jsonData)
  },

  async postNewUser(registerUser: RegisterUser) {
    return await jsonAction({
      method: 'post',
      url: 'user',
      data: registerUser,
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
    return jsonData
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
}

const methods = {
  changeEmail(email: string) {
    actions.patchUser({ email: email })
    user.email = email
  },
  changeUsername(username: string) {
    user.username = username
    actions.patchUser({ username: username })
  },
  changeRightHanded(rightHanded: boolean) {
    user.right_handed = rightHanded
    actions.patchUser({ right_handed: rightHanded }) // eslint-disable-line
  },
  changeTargetLearningTime(minutes: number) {
    user.target_learning_time = minutes * 60 * 1000
    actions.patchUser({ targetLearningTime: minutes })
  },
}

const userdata = {
  user: readonly(user) as User,
  methods,
  actions,
}

export default userdata
