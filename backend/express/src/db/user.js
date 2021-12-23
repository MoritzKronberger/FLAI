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

const postUser = async (data) => {
  const result = await query(
    `SELECT result
    FROM pg_axios
         ('user', $1,'POST'
         );`,
    [data]
  )
  return result.rows[0]
}

const patchUser = async (id, data) => {
  const result = await query(
    `SELECT result FROM pg_axios
    ('user',
      $2,
     'PATCH',
     $1);`,
    [{ id: id }, data]
  )

  return result.rows[0]
}

const deleteUser = async (id) => {
  const result = await query(
    `SELECT result FROM pg_axios
    ('user',
      NULL,
     'DELETE',
     $1);`,
    [{ id: id }]
  )
  return result.rows[0]
}

export { getUser, postUser, patchUser, deleteUser }
export default { getUser, postUser, patchUser, deleteUser }
