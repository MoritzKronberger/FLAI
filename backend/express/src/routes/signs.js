import express from 'express'
import { request } from './request.js'
const signs = express.Router()

signs.get('/:exercise_id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_full_sign',
    selectCols: ['id', 'name', 'motion_category', 'recordings'],
    /* eslint-disable */
    ids: {
      exercise_id: req.params.exercise_id,
    },
    /* eslint-enable */
    res: res,
  })
})

export { signs }
export default { signs }
