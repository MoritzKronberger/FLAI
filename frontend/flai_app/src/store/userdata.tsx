import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import authData from './authdata'
export interface User {
  [id: string]: string | number | undefined | boolean
  email: string
  username: string
  passwort: string
  right_handed: boolean
  target_learning_time: number
}
const user: User = reactive({
  id: '',
  email: '',
  username: '',
  passwort: '',
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
    user.id = authData.methods.fetchUserId()
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

  async postNewUser() {
    jsonAction({
      method: 'post',
      url: 'user',
      data: {
        username: 'martin',
        password: 'testmk1',
        email: 'martin.kohnle@flai-team.de',
      },
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

const userData = {
  user: readonly(user) as User,
  methods,
  actions,
}

export default userData
