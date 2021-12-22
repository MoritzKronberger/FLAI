import express from 'express'
import { getUser } from '../db/user.js'
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

account.get('/:id', async (req, res) => {
  try {
    const response = await getUser(req.params.id)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err.message)
  }
})

export { account }
export default { account }
