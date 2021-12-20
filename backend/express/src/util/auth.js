import jwt from 'jsonwebtoken'

function authToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = req.headers[authHeader]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403) // unvalid token
    req.user = user
    next()
  })
}

export { authToken }
export default { authToken }
