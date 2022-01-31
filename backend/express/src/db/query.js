import { query } from '../db.js'

const dbQuery = async (options) => {
  const method = options.method.toLowerCase()
  const table = options.table
  const data = options.data || null
  const ids = options.ids || null
  const selectCols = options.selectCols || null

  if (
    method === 'post' ||
    method === 'patch' ||
    method === 'delete' ||
    method === 'get'
  ) {
    const result = await query(
      `SELECT result
       FROM   rest_helper ($1, $2, $3, $4, $5);`,
      [table, data, method, ids, selectCols]
    )
    return result.rows[0]
  } else {
    throw `Method must be GET, POST, PATCH or DELETE. ${method} was given.`
  }
}

export { dbQuery }
export default { dbQuery }
