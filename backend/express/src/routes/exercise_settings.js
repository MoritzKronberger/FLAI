import express from 'express'
import { authToken } from '../util/auth.js'
import { request } from './request.js'
const exerciseSettings = express.Router()

exerciseSettings.patch(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.body.ids.user_id)
  },
  async (req, res) => {
    await request({
      method: 'PATCH',
      table: 'exercise_settings_user',
      data: req.body.data,
      ids: req.body.ids,
      res: res,
    })
  }
)
export { exerciseSettings }
export default { exerciseSettings }
