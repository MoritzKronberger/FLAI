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
    if (jwt && userId) {
      store.authdata.methods.saveAuthData({
        token: jwt,
        user_id: userId,
        isAuth: true,
      })
      const checkResult = await store.authdata.actions.checkTokenValid()
      if (checkResult.status === 200) {
        await store.authdata.actions.getApplicationData()
      } else {
        store.authdata.actions.logoutUser()
        return false
      }
    } else {
      return false
    }
  }
  return true
}
