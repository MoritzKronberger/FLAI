import express from 'express'
import { request } from './request.js'
//import { authToken } from '../util/auth.js'
const statistic = express.Router()

statistic.get('/active_streak', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_active_streak',
    selectCols: ['user_id', 'streak'],
    ids: req.query,
    res: res,
  })
})

statistic.get('/longest_streak', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_longest_streak',
    selectCols: ['user_id', 'start_day', 'end_day', 'streak'],
    ids: req.query,
    res: res,
  })
})

statistic.get('/exercise_completion', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_exercise_completion_progress',
    selectCols: ['user_id', 'exercise_id', 'progress_completion'],
    ids: req.query,
    res: res,
  })
})

statistic.get('/best_exercise_sign', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_best_exercise_sign',
    selectCols: ['user_id', 'exercise_id', 'sign_id', 'sign_name'],
    ids: req.query,
    res: res,
  })
})

export { statistic }
export default { statistic }
