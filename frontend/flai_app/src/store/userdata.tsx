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

const methods = {
  patchOptionsLocally(changes: User) {
    for (const prop in changes) {
      user[prop] = changes[prop]
    }
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
  async patchValues(patch: User) {
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
    return jsonData?.status
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
