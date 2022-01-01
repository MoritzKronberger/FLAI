import { reactive } from 'vue'
import { jsonAction } from '../common/service/rest'
export interface Auth {
  token: string
  email: string
  password: string
  username: string
  id: string
}

const auth = reactive({
  token: '',
  email: 'miriam.weber@email.com',
  password: 'supersecret',
  userId: '',
})

const methods = {
  fetchToken() {
    return auth.token
  },
  fetchUserId() {
    return auth.userId
  },

  logoutUser() {
    auth.token = ''
    window.location.href = 'localhost:3000/'
    console.log('User logged out')
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
    auth.token = jsonData?.data.jwt
    auth.userId = jsonData?.data.id
    console.log(jsonData)
  },
  /* eslint-enable */
}

const authData = {
  auth,
  methods,
  actions,
}

export { methods }
export default authData
