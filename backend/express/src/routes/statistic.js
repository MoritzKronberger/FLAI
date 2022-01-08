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

export { statistic }
export default { statistic }
