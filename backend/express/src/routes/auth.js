import express from 'express'
import jwt from 'jsonwebtoken'
import { generateAccessToken } from '../util/auth.js'
import { loginUser } from '../db/auth.js'
const auth = express.Router()

let refreshTokens = []

auth.post('/login', async (req, res) => {
  const { result } = await loginUser(req.body)
  if (result.status === 200) {
    const accessToken = generateAccessToken(result.ids.id)
    res.status(result.status).json({ ...result, jwt: accessToken })
  } else {
    res
      .status(result.status)
      .json({ ...result, message: 'Ungültige E-Mail-Adresse oder Passwort' })
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
