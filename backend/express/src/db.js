import { Pool } from 'pg'
const pool = new Pool({
  user: 'postgres',
  password: '',
  database: '',
  host: 'localhost',
  port: 5432,
})

export default pool
