import express from 'express'
import { request } from './request.js'
const exerciseSession = express.Router()

exerciseSession.get('/', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_active_exercise_session',
    selectCols: ['exercise_id', 'user_id', 'start_time'],
    ids: req.body,
    res: res,
  })
})

exerciseSession.post('/', async (req, res) => {
  await request({
    method: 'POST',
    table: 'exercise_session',
    data: req.body,
    res: res,
  })
})

exerciseSession.patch('/', async (req, res) => {
  await request({
    method: 'PATCH',
    table: 'exercise_session',
    data: req.body.data,
    ids: req.body.ids,
    res: res,
  })
})

exerciseSession.delete('/', async (req, res) => {
  await request({
    method: 'DELETE',
    table: 'exercise_session',
    ids: req.body,
    res: res,
  })
})

export { exerciseSession }
export default { exerciseSession }
