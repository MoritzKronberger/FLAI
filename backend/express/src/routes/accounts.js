import express from 'express'
import createAccount from '../schema/accounts-schema.js'
const account = express.Router()

account.post('/', async (req, res) => {
  try {
    const result = createAccount.validate(req.body)
    if (result) return res.send(result.error.details[0])
    /*const { name } = req.body
    const { email } = req.body
    const { password } = req.body
    const response = await db.createAccount(name, password, email)*/
    res.status(res.status).json(res)
  } catch (err) {
    console.log(err)
  }
})

export { account }
export default { account }
