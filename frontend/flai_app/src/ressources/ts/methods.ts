import { computed } from 'vue'
import store from '../../store'

export function errorMessage(message?: string) {
  if (!message) message = 'Sorry, there was an error.'
  alert(message)
}

// TODO: load into localStorage once tokens have expiration time
export async function authenticateFromSessionStorage() {
  const isAuth = computed(() => store.authdata.auth.isAuth)

  if (!isAuth.value) {
    const jwt = sessionStorage.getItem('jsonWebToken')
    const userId = sessionStorage.getItem('userId')
    // TODO: test if jwt is valid for user id
    if (jwt && userId) {
      store.authdata.methods.saveAuthData({
        token: jwt,
        user_id: userId,
        isAuth: true,
      })
      await store.authdata.actions.getApplicationData()
    } else {
      return false
    }
  }
  return true
}
