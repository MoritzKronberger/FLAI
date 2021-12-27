import express from 'express'
// import { authToken } from '../util/auth.js'
import { request } from './request.js'
const exercise = express.Router()

/* get all exercises
exercise.get('/', (req, res) => {
  try {
    const response = exercises.filter((ex) => ex.username === req.user.name)
    res.json(response)
  } catch (err) {
    console.log(err.message)
  }
})
*/

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
      'tasks',
    ],
    ids: req.body,
    res: res,
  })
})

/*
exercise.post('/', async (req, res) => {
  try {
    const { name } = req.body
    const { email } = req.body
    const response = await db.createNewTodo(name, email)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err)
  }
})

/*
exercise.put('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const { name } = req.body
    const response = await db.updateName(name, id)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err.message)
  }
})

exercise.delete('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = await db.deleteTodo(id)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err.message)
  }
})*/

export { exercise }
export default { exercise }
