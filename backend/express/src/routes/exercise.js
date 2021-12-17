import express from 'express'
const exercise = express.Router()

const exercises = {
  1: {
    id: '1',
    name: 'Buchstabieren',
    description: 'Übung mit Feedback',
    firstStart: '0',
    sessionDuration: '0',
  },
  2: {
    id: '2',
    name: 'Buchstabieren',
    description: 'Übung ohne Feedback',
    firstStart: '0',
    sessionDuration: '0',
  },
}

// get all exercises
exercise.get('/', async (req, res) => {
  try {
    const response = exercises
    res.json(response)
  } catch (err) {
    console.log(err.message)
  }
})
// get single exercise
exercise.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = exercises[id]
    res.json(response)
  } catch (err) {
    console.log(err.message)
  }
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
