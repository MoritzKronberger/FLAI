import axios from 'axios'

//const AUTH_TOKEN = ''
//axios.defaults.headers.common['Authorization'] = AUTH_TOKEN

axios.defaults.baseURL = 'https://localhost:5000/'
axios.defaults.headers.post['Content-Type'] = 'application/json'

const config = (_method, _url, _data = null) => {
  return {
    method: _method,
    url: _url,
    data: _data,
  }
}

const jsonResult = async (method, url, data = null) => {
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
  async JsonAction(method, url, data = null) {
    return await jsonResult(method, url, data)
  },
}
