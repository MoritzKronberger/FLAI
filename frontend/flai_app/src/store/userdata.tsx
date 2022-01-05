import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import authdata from './authdata'

export interface User {
  [id: string]: string | number | undefined | boolean
  email: string
  username: string
  right_handed: boolean
  target_learning_time: number
}
export interface Changes {
  [key: string]: string | boolean | number | undefined
}
export interface RegisterUser {
  username: string
  email: string
  password: string
  right_handed: boolean
}
const user: User = reactive({
  id: '',
  email: '',
  username: '',
  right_handed: true,
  target_learning_time: 10 * 60 * 1000, //millisec
})

const methods = {
  patchOptionsLocally(changes: Changes) {
    for (const prop in changes) {
      if (prop !== 'password') user[prop] = changes[prop]
    }
  },
  changeEmail(email: string) {
    user.email = email
  },
  changeUsername(username: string) {
    user.username = username
  },
  changeRightHanded(rightHanded: boolean) {
    user.right_handed = rightHanded
  },
  changeTargetLearningTime(minutes: number) {
    user.target_learning_time = minutes * 60 * 1000
  },
}

const actions = {
  async getUser() {
    user.id = authdata.methods.fetchUserId()
    const jsonData = await jsonAction({
      method: 'get',
      url: 'user',
      data: { id: user.id },
    })
    const data = jsonData?.data.rows[0]
    for (const prop in data) {
      user[prop] = data[prop]
    }
    console.log(user)
    return jsonData
  },

  async postNewUser(registerUser: RegisterUser) {
    return await jsonAction({
      method: 'post',
      url: 'user',
      data: registerUser,
    })
  },
  async patchValues(patch: Changes) {
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
      console.log('Patch', patch)
      methods.patchOptionsLocally(patch)
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

const userdata = {
  user: readonly(user) as User,
  methods,
  actions,
}

export default userdata
