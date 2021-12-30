import axios, { Method } from 'axios'

//const AUTH_TOKEN = ''
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

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
    const res = await axios(config)
    console.log('+++ Response received +++')
    console.log(res)
    return {
      status: res.status,
      headers: res.headers,
      data: res.data.rows,
    }
  } catch (error) {
    console.log(error)
  }
}

const jsonAction = async (options: AxiosOptions) => {
  return await jsonResult(config(options))
}

export { jsonAction }
export default { jsonAction }
