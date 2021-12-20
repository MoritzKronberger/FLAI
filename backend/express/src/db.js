import { Pool } from 'pg'
const pool = new Pool({
  user: 'postgres',
  password: '',
  database: 'flai_db_v1',
  host: 'localhost',
  port: 5432,
})

export default pool
