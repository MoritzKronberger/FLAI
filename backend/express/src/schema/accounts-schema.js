import Joi from 'joi'

const createAccount = Joi.object({
  username: Joi.string().min(5).max(40).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
  repeatPassword: Joi.ref('password'),
  email: Joi.string().email(),
})

export default createAccount
