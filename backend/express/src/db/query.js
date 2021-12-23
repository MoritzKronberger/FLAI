import { query } from '../db.js'

const dbQuery = async (options) => {
  const method = options.method.toLowerCase()
  const table = options.table
  const data = options.data || null
  const ids = options.ids || null
  const select = options.select

  if (method === 'get') {
    for (let row of select) {
      row = `"${row}"`
    }
    const selectParams = select.join(',')
    const result = await query(
      `SELECT ${selectParams}
       FROM ${table} 
       WHERE "id"=$1::UUID`,
      [ids]
    )
    result.rows.length === 0
      ? (result.rows[0] = { status: 404 })
      : (result.rows[0]['status'] = 200)
    return { result: result.rows[0] }
  } else if (method === 'post' || method === 'patch' || method === 'delete') {
    const result = await query(
      `SELECT result
       FROM pg_axios ('${table}', $2, '${method}', $1);`,
      [ids, data]
    )
    return result.rows[0]
  } else {
    throw `Method must be GET, POST, PATCH or DELETE. ${method} was given.`
  }
}

export { dbQuery }
export default { dbQuery }
