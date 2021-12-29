import axios, { Method } from 'axios'

//const AUTH_TOKEN = ''
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

axios.defaults.baseURL = 'http://localhost:5000/api/'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const config = (method: Method, url: string, data: object) => {
  return {
    method: method,
    url: url,
    data: data,
  }
}

const jsonResult = async (method: Method, url: string, data: object) => {
  try {
    const res = await axios(config(method, url, data))
    return {
      status: res.status,
      headers: res.headers,
      data: res.data,
    }
  } catch (error) {
    console.log(error)
  }
}

export default {
  async JsonAction(method: Method, url: string, data: object) {
    return await jsonResult(method, url, data)
  },
}
