import Joi from 'joi'

const createUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  email: Joi.string().email().required(),
  right_handed: Joi.boolean(),
  target_learning_time: Joi.string(),
})

const updateUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).message({
    'string.empty': '"Name" darf nicht leer sein',
    'string.pattern.base': '"Name" enthält ungültige Zeichen oder Länge [5,30]',
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).message({
    'string.empty': '"Passwort" darf nicht leer sein',
    'string.pattern.base':
      '"Passwort" enthält ungültige Zeichen oder Länge [5,30]',
  }),
  email: Joi.string().email().message({
    'string.empty': '"Email" darf nicht leer sein',
    'string.email': '"Email" enthält ungültige Zeichen',
  }),
  /* eslint-disable */
  right_handed: Joi.boolean(),
})

export { createUser, updateUser }
export default { createUser, updateUser }
