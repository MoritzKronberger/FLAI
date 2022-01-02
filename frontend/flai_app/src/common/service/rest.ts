import axios, { AxiosError, Method } from 'axios'
import authData from '../../store/authdata'

axios.defaults.baseURL = 'http://localhost:5000/api/'
axios.defaults.headers.post['Content-Type'] = 'application/json'
export interface AxiosOptions {
  method: Method
  url: string
  data: object
}

const config = (options: AxiosOptions) => {
  if (options.method === 'get') {
    return {
      method: options.method,
      url: options.url,
      params: options.data,
    }
  } else {
    return {
      method: options.method,
      url: options.url,
      data: options.data,
    }
  }
}

const authState = () => {
  const auth = authData.methods.fetchIsAuth()
  if (auth) {
    axios.defaults.headers.common['Authorization'] =
      authData.methods.fetchToken()
  } else {
    axios.defaults.headers.common['Authorization'] = ''
  }
}

const jsonResult = async (config: object) => {
  try {
    const res = await axios(config).then((value) => {
      return { status: value.status, data: value.data }
    })
    return res
  } catch (error) {
    const err = error as AxiosError
    return err.response
  }
}

const jsonAction = async (options: AxiosOptions) => {
  authState()
  return await jsonResult(config(options))
}

export { jsonAction }
export default { jsonAction }
