import express from 'express'
import { request } from './request.js'
import { createUser, updateUser } from '../schema/user-schema.js'
const user = express.Router()

user.post('/', async (req, res) => {
  await request({
    method: 'POST',
    table: 'user',
    data: req.body,
    validation: createUser,
    res: res,
  })
})

user.get('/:id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'user',
    ids: {
      id: req.params.id,
    },
    selectCols: [
      'id',
      'email',
      'username',
      'right_handed',
      'target_learning_time',
    ],
    res: res,
  })
})

user.patch('/:id', async (req, res) => {
  await request({
    method: 'PATCH',
    table: 'user',
    data: req.body,
    ids: {
      id: req.params.id,
    },
    validation: updateUser,
    res: res,
  })
})

user.delete('/:id', async (req, res) => {
  await request({
    method: 'DELETE',
    table: 'user',
    ids: { id: req.params.id },
    res: res,
  })
})

export { user }
export default { user }
