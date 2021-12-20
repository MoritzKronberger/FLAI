import express from 'express'

const app = express()

import cors from 'cors'

//import routes
import { exercise } from './routes/exercise.js'
import { signs } from './routes/signs.js'
import { account } from './routes/accounts.js'
import { auth } from './routes/auth.js'

// middleware
app.use(express.json())
app.use(cors())
app.use('/api/exercises', exercise)
app.use('/api/signs', signs)
app.use('/api/accounts', account)
app.use('/api/login', auth)

// server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`FLAI app listening at http://localhost:${port}`)
})
