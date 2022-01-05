import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
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
      console.log(jsonData.data)
      auth.token = jsonData?.data.jwt
      auth.user_id = jsonData?.data.ids.id
      auth.isAuth = methods.setAuth(true)
      await this.getApplicationData()
    }
    return jsonData
  },

  async getApplicationData() {
    if (auth.isAuth) {
      await userData.actions.getUser()
      await exerciseData.actions.getAllExercises()
      await exerciseData.actions.getFullExerciseForUser(
        exerciseData.exercises[0].id
      )
    }
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
