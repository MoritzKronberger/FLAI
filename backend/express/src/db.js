import { Pool } from 'pg'
const pool = new Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  host: process.env.PG_HOSTNAME,
  port: process.env.PG_PORT,
})

export default pool
