import express from 'express'
const signs = express.Router()

// get all signs
signs.get('/', async (req, res) => {
  try {
    const response = signs
    res.json(response)
  } catch (err) {
    console.log(err.message)
  }
})
// get single signs
signs.get('/:id', async (req, res) => {
  try {
    const id = req.params.id
    const response = signs[id]
    res.json(response)
  } catch (err) {
    console.log(err.message)
  }
})

export { signs }
export default { signs }
