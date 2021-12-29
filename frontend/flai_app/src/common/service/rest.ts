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
const jsonResult = async (method: Method, url: string, data: object) => {
  try {
    const res = await axios({ method: method, url: url, params: { data } })
    console.log(res.data.rows)
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
  const method = options.method
  const url = options.url
  const data = options.data
  return await jsonResult(method, url, data)
}

export { jsonAction }
export default { jsonAction }
