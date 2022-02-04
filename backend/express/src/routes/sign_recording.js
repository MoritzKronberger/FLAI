import express from 'express'
import { request } from './request.js'
const signRecording = express.Router()

signRecording.get('/sign', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_sign_recording',
    ids: req.query,
    selectCols: ['id', 'path', 'mimetype', 'perspective', 'sign_id'],
    res: res,
  })
})

signRecording.get('/sign/exercise', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_sign_recording_for_exercise',
    ids: req.query,
    selectCols: ['id', 'path', 'mimetype', 'perspective', 'sign_id'],
    res: res,
  })
})

export { signRecording }
export default { signRecording }
