import express from 'express'
import { request } from './request.js'
import { authToken } from '../util/auth.js'
import { getTrends } from '../db/trends.js'
const statistic = express.Router()

statistic.get(
  '/active_streak',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_active_streak',
      selectCols: ['user_id', 'streak'],
      ids: req.query,
      res: res,
    })
  }
)

statistic.get(
  '/longest_streak',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_longest_streak',
      selectCols: ['user_id', 'start_day', 'end_day', 'streak'],
      ids: req.query,
      res: res,
    })
  }
)

statistic.get(
  '/exercise_completion',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_exercise_completion_progress',
      selectCols: ['user_id', 'exercise_id', 'progress_completion'],
      ids: req.query,
      res: res,
    })
  }
)

statistic.get(
  '/best_exercise_sign',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_best_exercise_sign',
      selectCols: ['user_id', 'exercise_id', 'sign_id', 'sign_name'],
      ids: req.query,
      res: res,
    })
  }
)

statistic.get(
  '/time_learnt_by_day',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_time_learnt_by_day',
      selectCols: ['user_id', 'day', 'time_learnt'],
      ids: req.query,
      res: res,
    })
  }
)

statistic.get(
  '/trends',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    try {
      const result = await getTrends(
        req.query.end_day,
        req.query.days,
        req.query.user_id
      )
      console.log(result)
      if (result.rows.length > 0) {
        res.status(200).json({ rows: result.rows })
      } else {
        res.status(404).json({ message: 'trends exist' })
      }
    } catch (err) {
      console.log(err)
      res.status(500)
    }
  }
)

export { statistic }
export default { statistic }
