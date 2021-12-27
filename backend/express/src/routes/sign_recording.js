import express from 'express'
import { request } from './request.js'
const signRecording = express.Router()

signRecording.get('/:id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_sign_recording',
    ids: {
      id: req.params.id,
    },
    selectCols: ['id', 'path', 'mimetype', 'perspective'],
    res: res,
  })
})

export { signRecording }
export default { signRecording }
