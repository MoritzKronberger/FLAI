import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'

export interface Auth {
  token: string
  email: string
  password: string
  user_id: string
  isAuth: boolean
}

export interface LoginUser {
  email: string
  password: string
}

const auth: Auth = reactive({
  token: '',
  email: 'miriam.weber@email.com',
  password: 'supersecret',
  user_id: '',
  isAuth: false,
})

const methods = {
  fetchToken() {
    return auth.token
  },
  fetchUserId() {
    return auth.user_id
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
  async loginUser(loginUser: LoginUser) {
    const jsonData = await jsonAction({
      method: 'post',
      url: 'auth/login',
      data: loginUser,
    })
    if(jsonData?.status === 200){
      auth.token = jsonData?.data.jwt
      auth.user_id = jsonData?.data.ids.id
      auth.isAuth = methods.setAuth(true)
    }
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
