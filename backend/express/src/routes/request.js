import { dbQuery } from '../db/query.js'

const request = async (options) => {
  const method = options.method.toLowerCase()
  const table = options.table
  const data = options.data || null
  const ids = options.ids || null
  const select = options.select
  const validation = options.validation
  const res = options.res

  try {
    if (validation) {
      const validResult = validation.validate(data)
      if (validResult.error) return res.send(validResult)
    }
    const { result } = await dbQuery({
      method: method,
      table: table,
      data: data,
      ids: ids,
      select: select,
    })
    console.log(result)
    res.status(result.status).json(result)
  } catch (err) {
    console.log(err.message)
  }
}

export { request }
export default { request }
