import axios from 'axios'

const apiCall = axios.create({
  baseURL: 'localhost:5000/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

export default {
  getApi(path) {
    return apiCall.get(path)
  },
}
