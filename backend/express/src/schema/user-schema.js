import Joi from 'joi'

const usernameMessage = {
  'string.empty': 'Benutzername ist leer',
  'string.pattern.base': 'Benutzername enthält ungültige Zeichen',
  'string.max': 'Benutzername ist länger als 30 Zeichen',
}

const passwordMessage = {
  'string.empty': 'Passwort ist leer',
  'string.min': 'Passwort ist kürzer als 8 Zeichen',
}

const emailMessage = {
  'string.empty': 'E-Mail-Adresse ist leer',
  'string.email': 'E-Mail-Adresse ist ungültig',
}

const createUser = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('(\\w|\\s)$'))
    .max(30)
    .required()
    .messages(usernameMessage),
  password: Joi.string().min(8).messages(passwordMessage).required(),
  email: Joi.string().email().messages(emailMessage).required(),
  right_handed: Joi.boolean(),
  target_learning_time: Joi.string(),
})

const updateUser = Joi.object({
  username: Joi.string()
    .pattern(new RegExp('(\\w|\\s)$'))
    .max(30)
    .messages(usernameMessage),
  password: Joi.string().min(8).messages(passwordMessage),
  email: Joi.string().email().messages(emailMessage),
  right_handed: Joi.boolean(),
  target_learning_time: Joi.string(),
})

export { createUser, updateUser }
export default { createUser, updateUser }
