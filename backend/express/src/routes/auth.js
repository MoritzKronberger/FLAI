import express from 'express'
import jwt from 'jsonwebtoken'
const auth = express.Router()

auth.post('/', (req, res) => {
  const username = req.body.username
  const user = { name: username }
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
  res.json({ accessToken: accessToken })
})

export { auth }
export default { auth }
