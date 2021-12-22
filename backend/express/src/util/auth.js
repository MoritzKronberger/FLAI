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

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '40s' })
}

export { authToken, generateAccessToken }
export default { authToken, generateAccessToken }
