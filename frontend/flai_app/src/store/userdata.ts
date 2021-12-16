import { reactive, readonly } from 'vue'

export interface User {
  id: string //uuid
  email: string
  username: string
  rightHanded: boolean
}

const user: User = reactive({
  id: '',
  email: '',
  username: '',
  rightHanded: true,
})

const methods = {
  changeEmail(email: string) {
    user.email = email
  },
  changeUsername(username: string) {
    user.username = username
  },
}

export default { user: readonly(user), methods }
