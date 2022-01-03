import axios, { Axios, AxiosError, Method } from 'axios'
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

const jsonResult = async (config: object, callback?: any) => {
  try {
    const res = await axios(config).then((value) => {
      return { status: value.status, data: value.data }
    })
    return res
  } catch (error) {
    const err = error as AxiosError
    if (err.response)
      return { status: err.response.status, data: err.response.data }
    callback
  }
}

const jsonAction = async (options: AxiosOptions, callback?: any) => {
  authState()
  return await jsonResult(config(options), callback)
}

export { jsonAction }
export default { jsonAction }
