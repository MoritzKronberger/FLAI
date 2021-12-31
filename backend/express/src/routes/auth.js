import express from 'express'
import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../util/auth.js'
import { loginUser } from '../db/auth.js'
const auth = express.Router()

let refreshTokens = []

auth.post('/login', async (req, res) => {
  console.log(req.query)
  const { status, id } = await loginUser(req.query.email, req.query.password)
  if (status === 200) {
    const accessToken = generateAccessToken(id)
    res
      .set('Authorization', `Bearer ${accessToken}`)
      .status(status)
      .json({ message: 'logged in' })
  } else {
    res.status(status).json({ message: 'not logged in' })
  }
})

auth.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.name })
    res.json({ accessToken: accessToken, refreshToken: refreshToken })
  })
})

auth.delete('/logout', (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204)
})

export { auth }
export default { auth }
