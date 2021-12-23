import pg from 'pg'

const pool = new pg.Pool({
    host: process.env.PG_HOSTNAME,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DB,
    port: process.env.PG_PORT,
  }),
  query = async (pSql, pParams) => await pool.query(pSql, pParams),
  transaction = async (pQueryCallback) => {
    const client = await pool.connect()
    try {
      await client.query('BEGIN')
      await pQueryCallback(client)
      await client.query('COMMIT')
    } catch (pError) {
      await client.query('ROLLBACK')
      throw pError
    } finally {
      client.release()
    }
  }

export { query, transaction }

export default { query, transaction }
