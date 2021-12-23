import express from 'express'
import { request } from './request.js'
const task = express.Router()

task.get('/:id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_full_task',
    ids: req.params.id,
    select: ['id', 'name', 'description', 'signs'],
    res: res,
  })
})

export { task }
export default { task }
