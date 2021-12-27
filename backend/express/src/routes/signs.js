import express from 'express'
import { request } from './request.js'
const signs = express.Router()

signs.get('/:id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_full_sign',
    ids: {
      id: req.params.id,
    },
    selectCols: ['id', 'name', 'motion_category', 'recordings'],
    res: res,
  })
})

export { signs }
export default { signs }
