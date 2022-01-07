import jwt from 'jsonwebtoken'
function authToken(req, res, next, userId) {
  const token = req.headers['authorization']
  // TODO: remove debug logs
  console.log('--- NEW REQUEST ---')
  console.log(`Token: ${token}`)
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, id) => {
    console.log(`decoded-id: ${id}; user_id: ${userId}`)
    if (err) return res.sendStatus(403) // unvalid token
    if (id !== userId) return res.sendStatus(401)
    // TODO: not needed?
    //res.id = id
    next()
  })
}

function generateAccessToken(id) {
  return jwt.sign(id, process.env.ACCESS_TOKEN_SECRET)
}

export { authToken, generateAccessToken }
export default { authToken, generateAccessToken }
