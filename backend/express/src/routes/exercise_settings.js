import express from 'express'
import { request } from './request.js'
const exerciseSettings = express.Router()

exerciseSettings.patch('/', async (req, res) => {
  await request({
    method: 'PATCH',
    table: 'exercise_settings_user',
    data: req.body.data,
    ids: req.body.ids,
    res: res,
  })
})
export { exerciseSettings }
export default { exerciseSettings }
