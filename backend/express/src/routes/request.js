import { dbQuery } from '../db/query.js'

const request = async (options) => {
  const method = options.method.toLowerCase()
  const table = options.table
  const data = options.data || null
  const ids = options.ids || null
  const selectCols = options.selectCols || null
  const validation = options.validation
  const res = options.res

  try {
    if (validation) {
      const validResult = validation.validate(data)
      if (validResult.error)
        return res.status(422).send(validResult.error.details[0])
    }
    const { result } = await dbQuery({
      method: method,
      table: table,
      data: data,
      ids: ids,
      selectCols: selectCols,
    })
    res.status(result.status).json(result)
  } catch (err) {
    console.log(err.message)
  }
}

export { request }
export default { request }
