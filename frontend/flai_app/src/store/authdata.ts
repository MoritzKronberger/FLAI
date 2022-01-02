import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
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
  async loginUser(authdata: object) {
    const jsonData = await jsonAction({
      method: 'post',
      url: 'auth/login',
      data: authdata,
    })
    auth.token = jsonData?.data.jwt
    auth.userId = jsonData?.data.id
    auth.isAuth = methods.setAuth(true)
    return jsonData
  },

  logoutUser() {
    auth.token = ''
    auth.isAuth = false
    console.log('User logged out')
  },
  /* eslint-enable */
}

const authdata = {
  auth: readonly(auth) as Auth,
  methods,
  actions,
}

export default authdata
