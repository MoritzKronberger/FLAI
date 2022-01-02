import { query } from '../db.js'

const loginUser = async (email, password) => {
  const result = await query(
    `SELECT check_password($1::D_EMAIL, $2::VARCHAR) AS authorized, 
    "id"
FROM  "user"
WHERE "email" = $1::D_EMAIL
`,
    [email, password]
  )
  return result.rows[0]
    ? { status: result.rows[0].authorized ? 200 : 401, id: result.rows[0].id }
    : { status: 401, id: '' }
}

export { loginUser }
export default { loginUser }
