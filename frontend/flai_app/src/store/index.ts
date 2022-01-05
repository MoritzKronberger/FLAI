import userdata from './userdata'
import sessiondata from './sessiondata'
import exercisedata from './exercisedata'
import signdata from './signdata'
import handposedata from './handposedata'
import flainetdata from './flainetdata'
import authdata from './authdata'

export const networkMessage =
  'Sorry, you need  to have internet access to do this!'

const store = {
  networkMessage,
  userdata,
  sessiondata,
  exercisedata,
  signdata,
  handposedata,
  flainetdata,
  authdata,
}

export default store
