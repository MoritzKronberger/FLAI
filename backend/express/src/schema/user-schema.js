import Joi from 'joi'

const createUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).required(),
  email: Joi.string().email().required(),
  /* eslint-disable */
  right_handed: Joi.boolean(),
  /* eslint-enable */
})

const updateUser = Joi.object({
  username: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).message({
    'string.empty': '"username" darf nicht leer sein',
    'string.min': '"username" benötigt mindestens 5 Charaktere',
    'string.pattern.base': '"username" enthält unerlaubte Zeichen',
  }),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{5,30}$')).message({
    'string.empty': '"passwort" darf nicht leer sein',
    'string.min': '"passwort" benötigt mindestens 5 Charaktere',
    'string.pattern.base': '"passwort" enthält unerlaubte Zeichen',
  }),
  email: Joi.string().email(),
  /* eslint-disable */
  right_handed: Joi.boolean(),
  /* eslint-enable */
})

export { createUser, updateUser }
export default { createUser, updateUser }
