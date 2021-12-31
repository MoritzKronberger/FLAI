import axios, { AxiosError, Method } from 'axios'
import userData from '../../store/authdata'
const AUTH_TOKEN =
  'eyJhbGciOiJIUzI1NiJ9.MDc5Yzg3MjUtM2I0Ny00MzRjLWJhMWEtYWZlM2E4MTYyZGFj.X2bs0vZQyfT-asu-S_hHdwpfhzTFm2rvQmy65LzeWmU'
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

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
      return { status: value.status, headers: value.headers, data: value.data }
    })
    return res
  } catch (error) {
    const err = error as AxiosError
    console.log('--- Something went wrong ---')
    console.log(err.response?.status)
  }
}

const jsonAction = async (options: AxiosOptions) => {
  return await jsonResult(config(options))
}

export { jsonAction }
export default { jsonAction }
