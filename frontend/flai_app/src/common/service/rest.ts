import axios, { AxiosError, Method } from 'axios'
import authdata from '../../store/authdata'

axios.defaults.baseURL = '/api'
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
  const auth = authdata.methods.fetchIsAuth()
  if (auth) {
    axios.defaults.headers.common['Authorization'] =
      authdata.methods.fetchToken()
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
    if (err.response)
      return { status: err.response.status, data: err.response.data }
    return { status: 503, data: { message: 'Network Error' } }
  }
}

const jsonAction = async (options: AxiosOptions) => {
  authState()
  return await jsonResult(config(options))
}

export { jsonAction }
export default { jsonAction }
