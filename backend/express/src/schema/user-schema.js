import Joi from 'joi'

const createUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  email: Joi.string().email().required(),
  right_handed: Joi.boolean(),
  target_learning_time: Joi.string(),
})

const updateUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')),
  email: Joi.string().email(),
  right_handed: Joi.boolean(),
})

export { createUser, updateUser }
export default { createUser, updateUser }
