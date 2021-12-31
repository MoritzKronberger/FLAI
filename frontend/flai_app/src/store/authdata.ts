import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'

export interface Auth {
  id: string
  email: string
  password: string
  username: string
}

const auth: Auth = reactive({
  id: '',
  email: '',
  password: '',
  username: '',
})

const methods = {}

const actions = {
  /* eslint-disable */
  async loginUser() {
    jsonAction({
      method: 'get',
      url: 'auth/login',
      data: { id: '079c8725-3b47-434c-ba1a-afe3a8162dac' },
    })
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
