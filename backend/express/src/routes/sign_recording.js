import express from 'express'
import { request } from './request.js'
const signRecording = express.Router()

signRecording.get('/sign/:sign_id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_sign_recording',
    /* eslint-disable */
    ids: {
      sign_id: req.params.sign_id,
    },
    /* eslint-enable */
    selectCols: ['id', 'path', 'mimetype', 'perspective', 'sign_id'],
    res: res,
  })
})

signRecording.get('/exercise/:exercise_id', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_sign_recording_for_exercise',
    /* eslint-disable */
    ids: {
      exercise_id: req.params.exercise_id,
    },
    /* eslint-enable */
    selectCols: ['id', 'path', 'mimetype', 'perspective', 'sign_id'],
    res: res,
  })
})

export { signRecording }
export default { signRecording }
