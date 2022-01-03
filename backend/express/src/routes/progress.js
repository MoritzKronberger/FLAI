import express from 'express'
import { request } from './request.js'
const progress = express.Router()

progress.get('/', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_progress',
    ids: req.body,
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
})

progress.patch('/', async (req, res) => {
  await request({
    method: 'PATCH',
    table: 'learns_sign',
    data: req.body.data,
    ids: req.body.ids,
    res: res,
  })
})

export { progress }
export default { progress }
