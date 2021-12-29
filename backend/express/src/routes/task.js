import express from 'express'
import { request } from './request.js'
const task = express.Router()

task.get('/:exercise_id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_task',
    /* eslint-disable */
    ids: {
      exercise_id: req.params.exercise_id,
    },
    /* eslint-enable */
    selectCols: ['id', 'name', 'description', 'exercise_id'],
    res: res,
  })
})

export { task }
export default { task }
