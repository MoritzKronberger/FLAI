import { query } from '../db.js'

const loginUser = async (loginData) => {
  const result = await query(
    `SELECT result
     FROM   check_password($1);`,
    [loginData]
  )
  return result.rows[0]
}

export { loginUser }
export default { loginUser }
