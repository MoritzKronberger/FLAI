import { reactive } from 'vue'

export interface User {
  id: string //uuid
  email: string
  username: string
}

const user = reactive({
  id: null,
  email: null,
  username: null,
})

export default { user }
