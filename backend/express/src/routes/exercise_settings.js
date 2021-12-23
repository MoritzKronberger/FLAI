import express from 'express'
import { request } from './request.js'
const exerciseSettings = express.Router()

exerciseSettings.patch('/:id', async (req, res) => {
  await request({
    method: 'PATCH',
    table: 'exercise_settings_user',
    data: req.body,
    ids: {
      id: req.params.id,
    },
    res: res,
  })
})
export { exerciseSettings }
export default { exerciseSettings }
