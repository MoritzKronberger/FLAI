import express from 'express'
import { request } from './request.js'
import { createUser, updateUser } from '../schema/user-schema.js'
import { authToken } from '../util/auth.js'
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

user.get(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.query.id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'user',
      ids: req.query,
      selectCols: [
        'id',
        'email',
        'username',
        'right_handed',
        'target_learning_time',
      ],
      res: res,
    })
  }
)

user.patch(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.body.ids.id)
  },
  async (req, res) => {
    await request({
      method: 'PATCH',
      table: 'user',
      data: req.body.data,
      ids: req.body.ids,
      validation: updateUser,
      res: res,
    })
  }
)

user.delete(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.query.id)
  },
  async (req, res) => {
    await request({
      method: 'DELETE',
      table: 'user',
      ids: req.query,
      res: res,
    })
  }
)

export { user }
export default { user }
