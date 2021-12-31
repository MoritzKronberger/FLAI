import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'

export interface Auth {
  token: string
  email: string
  password: string
  username: string
}

const auth: Auth = reactive({
  token: '',
  email: '',
  password: '',
  username: '',
})

const methods = {}

const actions = {
  /* eslint-disable */
  async loginUser() {
    const jsonData = await jsonAction({
      method: 'get',
      url: 'auth/login',
      data: { email: 'miriam.weber@email.com', password: 'supersecret'},
    })
    console.log(jsonData)
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

const userData = {
  user: readonly(auth) as Auth,
  methods,
  actions,
}

export default userData
