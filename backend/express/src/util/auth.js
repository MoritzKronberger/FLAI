import jwt from 'jsonwebtoken'

function authToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = req.headers[authHeader]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403) // unvalid token
    req.user = user
    next()
  })
}

function generateAccessToken(user, ACCESS_TOKEN_SECRET) {
  return jwt.sign(user, ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

export { authToken, generateAccessToken }
export default { authToken, generateAccessToken }
