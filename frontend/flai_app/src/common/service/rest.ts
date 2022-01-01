import axios, { AxiosError, Method } from 'axios'
import { methods } from '../../store/authdata'
let AUTH_TOKEN = ''

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

const jsonResult = async (config: object) => {
  try {
    const res = await axios(config).then((value) => {
      return { status: value, data: value.data }
    })
    return res
  } catch (error) {
    const err = error as AxiosError
    console.log('--- Something went wrong ---')
    console.log(err.response?.status)
  }
}

const jsonAction = async (options: AxiosOptions) => {
  if (AUTH_TOKEN === '') {
    AUTH_TOKEN = methods.fetchToken()
    axios.defaults.headers.common['Authorization'] = AUTH_TOKEN
  }

  return await jsonResult(config(options))
}

export { jsonAction }
export default { jsonAction }
