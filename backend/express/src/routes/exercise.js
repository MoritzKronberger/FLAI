import express from 'express'
import { authToken } from '../util/auth.js'
import { request } from './request.js'
const exercise = express.Router()

exercise.get('/all', async (req, res) => {
  await request({
    method: 'GET',
    table: 'get_exercise',
    selectCols: ['id', 'name', 'description'],
    res: res,
  })
})

exercise.get(
  '/',
  (req, res, next) => {
    authToken(req, res, next, req.query.user_id)
  },
  async (req, res) => {
    await request({
      method: 'GET',
      table: 'get_full_exercise_for_user',
      selectCols: [
        'id',
        'user_id',
        'name',
        'description',
        'level_1',
        'level_2',
        'level_3',
        'progress_add',
        'progress_sub',
        'sort_signs_by_order',
        'task_split',
        'word_length',
        'unlocked_signs',
      ],
      ids: req.query,
      res: res,
    })
  }
)

export { exercise }
export default { exercise }
