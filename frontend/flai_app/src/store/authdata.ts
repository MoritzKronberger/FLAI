import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import { errorMessage } from '../ressources/ts/methods'

export interface Auth {
  token: string
  email: string
  password: string
  userId: string
  isAuth: boolean
}

const auth: Auth = reactive({
  token: '',
  email: 'miriam.weber@email.com',
  password: 'supersecret',
  userId: '',
  isAuth: false,
})

const methods = {
  fetchToken() {
    return auth.token
  },
  fetchUserId() {
    return auth.userId
  },

  fetchIsAuth() {
    return auth.isAuth
  },

  setAuth(state: boolean) {
    return (auth.isAuth = state)
  },
}

const actions = {
  /* eslint-disable */
  async loginUser() {
    const jsonData = await jsonAction({
      method: 'post',
      url: 'auth/login',
      data: { email: auth.email, password: auth.password },
    })
    if (jsonData?.status === 200) {
      auth.token = jsonData?.data.jwt
      auth.userId = jsonData?.data.id
      auth.isAuth = methods.setAuth(true)
    }
    console.log(jsonData)
  },

  logoutUser() {
    auth.token = ''
    auth.isAuth = false
    console.log('User logged out')
  },
  /* eslint-enable */
}

const authData = {
  auth: readonly(auth) as Auth,
  methods,
  actions,
}

export default authData
