import express from 'express'
import { request } from './request.js'
const signs = express.Router()

signs.get('/', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_full_sign_for_exercise',
    selectCols: ['id', 'name', 'motion_category', 'exercise_id', 'order'],
    ids: req.query,
    res: res,
  })
})

export { signs }
export default { signs }
