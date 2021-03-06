import { reactive, readonly } from 'vue'
import store from '.'
import { jsonAction } from '../common/service/rest'
import { PostgresData } from '../ressources/ts/interfaces'
import exerciseData from './exercisedata'
import userData from './userdata'

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

export interface AuthData {
  token: string
  user_id: string
  isAuth: boolean
}

const auth: Auth = reactive({
  token: '',
  email: '',
  password: '',
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

  saveAuthData(authData: AuthData) {
    auth.token = authData.token
    auth.user_id = authData.user_id
    auth.isAuth = authData.isAuth
  },
  logoutUser() {
    // reset autdata
    auth.token = ''
    auth.isAuth = false
    // reset userdata
    store.userdata.methods.changeEmail('')
    store.userdata.methods.changeUsername('')
    // reset session storage
    sessionStorage.removeItem('jsonWebToken')
    sessionStorage.removeItem('userId')
  },
}

const actions = {
  async loginUser(loginUser: LoginUser) {
    const jsonData = await jsonAction({
      method: 'post',
      url: 'auth/login',
      data: loginUser,
    })
    if (jsonData?.status === 200) {
      const data = jsonData.data as PostgresData
      if (data.jwt && data.ids) {
        sessionStorage.setItem('jsonWebToken', data.jwt)
        const userId = data.ids.id as string
        sessionStorage.setItem('userId', userId)
        methods.saveAuthData({
          token: data.jwt,
          user_id: userId,
          isAuth: true,
        })
        await this.getApplicationData()
      }
    }
    return jsonData
  },

  async checkTokenValid() {
    const userId = methods.fetchUserId()
    const jsonData = await jsonAction({
      method: 'post',
      url: 'auth/checktoken',
      data: { id: userId },
    })
    return jsonData
  },

  async getApplicationData() {
    if (auth.isAuth) {
      await userData.actions.getUser()
      await exerciseData.actions.getAllExercises()
      await store.statisticdata.actions.getUserStatistic()
    }
  },
}

const authdata = {
  auth: readonly(auth) as Auth,
  methods,
  actions,
}

export default authdata
