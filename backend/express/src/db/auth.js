import { query } from '../db.js'

const loginUser = async (email, password) => {
  const result = await query(
    `SELECT check_password($1::VARCHAR, $2::VARCHAR) AS authorized, 
    "id"
FROM  "user"
WHERE "email" = $1::VARCHAR
`,
    [email, password]
  ).rows[0]
  return result
    ? { status: result.authorized ? 200 : 401, id: result.id }
    : { status: 401, id: '' }
}

export { loginUser }
export default { loginUser }
