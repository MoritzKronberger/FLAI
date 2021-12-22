import { query } from '../db.js'

const getUser = async (id) => {
  const result = await query(
    `SELECT "id", "email", "username", "right_handed", "target_learning_time" 
    FROM get_user 
    WHERE "id"=$1::UUID`,
    [id]
  )
  return result.rows.length === 0
    ? { status: 404, result: {} }
    : { status: 200, result: result.rows[0] }
}

export { getUser }
export default { getUser }
