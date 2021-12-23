import express from 'express'
import { request } from './request.js'
const signRecording = express.Router()

signRecording.get('/:id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_sign_recording',
    ids: req.params.id,
    select: ['id', 'path', 'mimetype', 'perspective'],
    res: res,
  })
})

export { signRecording }
export default { signRecording }
