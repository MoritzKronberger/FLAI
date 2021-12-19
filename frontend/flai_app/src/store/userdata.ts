import { reactive, readonly } from 'vue'

export interface User {
  id: string //uuid
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
  changeEmail(email: string) {
    user.email = email
  },
  changeUsername(username: string) {
    user.username = username
  },
  changeRightHanded(rightHanded: boolean) {
    user.rightHanded = rightHanded
  },
  changeTargetLearningTime(minutes: number) {
    user.targetLearningTime = minutes * 60 * 1000
  },
}

const userdata = { user: readonly(user), methods }

export default userdata
