import express from 'express'
import { request } from './request.js'
import { authToken } from '../util/auth.js'
const progress = express.Router()

progress.get(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_progress',
      ids: req.query,
      selectCols: [
        'user_id',
        'sign_id',
        'exercise_id',
        'progress',
        'intro_done',
        'level_3_reached',
      ],
      res: res,
    })
  }
)

progress.patch(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.body.ids.user_id)
  },
  async (req, res) => {
    await request({
      method: 'PATCH',
      table: 'learns_sign',
      data: req.body.data,
      ids: req.body.ids,
      res: res,
    })
  }
)

export { progress }
export default { progress }
