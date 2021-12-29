import express from 'express'
import { jsonHelper } from '../util/jsonhelper.js'
// import { authToken } from '../util/auth.js'
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

exercise.get('/', async (req, res) => {
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
      'sort_signs_by_order',
      'task_split',
      'word_length',
      'unlocked_signs',
    ],
    ids: jsonHelper(req.query),
    res: res,
  })
})

export { exercise }
export default { exercise }
