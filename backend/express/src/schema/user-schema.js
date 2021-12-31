import Joi from 'joi'

const createUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  email: Joi.string().email().required(),
})

const updateUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
  email: Joi.string().email(),
})

export { createUser, updateUser }
export default { createUser, updateUser }
