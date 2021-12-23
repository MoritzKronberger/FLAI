import express from 'express'
import { getUser, postUser, patchUser, deleteUser } from '../db/user.js'
import { createUser, updateUser } from '../schema/user-schema.js'
const user = express.Router()

user.post('/', async (req, res) => {
  try {
    const validResult = createUser.validate(req.body)
    if (validResult.error) return res.send(validResult)
    const { result } = await postUser(req.body)
    res.status(result.status).json(result)
  } catch (err) {
    console.log(err)
  }
})

user.get('/:id', async (req, res) => {
  try {
    const response = await getUser(req.params.id)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err.message)
  }
})

user.patch('/:id', async (req, res) => {
  try {
    const validResult = updateUser.validate(req.body)
    if (validResult.error) return res.send(validResult)
    const { result } = await patchUser(req.params.id, req.body)
    res.status(result.status).json(result)
  } catch (err) {
    console.log(err.message)
  }
})

user.delete('/:id', async (req, res) => {
  try {
    const { result } = await deleteUser(req.params.id)
    res.status(result.status).json(result)
  } catch (err) {
    console.log(err.message)
  }
})

export { user }
export default { user }
