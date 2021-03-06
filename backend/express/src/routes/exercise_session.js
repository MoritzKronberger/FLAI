import express from 'express'
import { authToken } from '../util/auth.js'
import { request } from './request.js'
const exerciseSession = express.Router()

exerciseSession.get(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_active_exercise_session',
      selectCols: ['exercise_id', 'user_id', 'start_time'],
      ids: req.query,
      res: res,
    })
  }
)

exerciseSession.post(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.body.user_id)
  },
  async (req, res) => {
    await request({
      method: 'POST',
      table: 'exercise_session',
      selectCols: ['exercise_id', 'user_id', 'start_time'],
      data: req.body,
      res: res,
    })
  }
)

exerciseSession.patch(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.body.ids.user_id)
  },
  async (req, res) => {
    await request({
      method: 'PATCH',
      table: 'exercise_session',
      data: req.body.data,
      ids: req.body.ids,
      res: res,
    })
  }
)

exerciseSession.delete(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.body.user_id)
  },
  async (req, res) => {
    await request({
      method: 'DELETE',
      table: 'exercise_session',
      ids: req.body,
      res: res,
    })
  }
)

export { exerciseSession }
export default { exerciseSession }
