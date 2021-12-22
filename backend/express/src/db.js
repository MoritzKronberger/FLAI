import pg from 'pg'

const {
    PGHOST = 'localhost',
    PGUSER = 'mk',
    PGPASSWORD = 'mk',
    PGDATABASE = 'flai_db_v1',
    PGPORT = 5432,
  } = process.env,
  pool = new pg.Pool({
    host: PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    database: PGDATABASE,
    port: PGPORT,
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
