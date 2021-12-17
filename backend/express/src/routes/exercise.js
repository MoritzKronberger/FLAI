import express from 'express'
const exercise = express.Router()

exercise.get('/', async (res) => {
  try {
    const response = 'Hello'
    //res.status(response.status).json(response.result)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err.message)
  }
})

/*exercise.get('/:id', async (req, res) => {
  try {
    const response = await db.getTodo(req.params.id)
    res.status(response.status).json(response.result)
  } catch (err) {
    console.log(err.message)
  }
})

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
