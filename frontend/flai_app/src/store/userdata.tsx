import { reactive, readonly } from 'vue'
import { jsonAction } from '../common/service/rest'
import authData from './authdata'
export interface User {
  [id: string]: string | number | undefined | boolean
  email: string
  username: string
  rightHanded: boolean
  targetLearningTime: number
}
const user: User = reactive({
  id: '',
  email: '',
  username: '',
  rightHanded: true,
  targetLearningTime: 10 * 60 * 1000, //millisec
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
    user.email = data.email
    user.username = data.username
    user.rightHanded = data.right_handed
    user.targetLearningTime = data.target_learning_time
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
  async patchValues(patch: object) {
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
    return jsonData
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
