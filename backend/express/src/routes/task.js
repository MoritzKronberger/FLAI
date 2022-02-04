import express from 'express'
import { request } from './request.js'
const task = express.Router()

task.get('/', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_task',
    ids: req.query,
    selectCols: ['id', 'name', 'description', 'exercise_id'],
    res: res,
  })
})

export { task }
export default { task }
