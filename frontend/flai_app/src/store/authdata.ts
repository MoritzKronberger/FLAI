import { reactive } from 'vue'
import { jsonAction } from '../common/service/rest'
export interface Auth {
  token: string
  email: string
  password: string
  username: string
}

const auth = reactive({
  token: '',
  email: '',
  password: '',
  username: '',
})

const methods = {
  fetchToken() {
    return auth.token
  },
}

const actions = {
  /* eslint-disable */
  async loginUser() {
    const jsonData = await jsonAction({
      method: 'post',
      url: 'auth/login',
      data: { email: 'miriam.weber@email.com', password: 'supersecret' },
    })
    auth.token = jsonData?.data.jwt
    console.log(auth.token)
  },

  async logoutUser() {
    jsonAction({
      method: 'post',
      url: 'auth/logout',
      data: { id: '079c8725-3b47-434c-ba1a-afe3a8162dac' },
    })
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
