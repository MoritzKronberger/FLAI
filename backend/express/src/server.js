import express from 'express'
import dotenv from 'dotenv'
const app = express()

import cors from 'cors'
dotenv.config()
//import routes
import { exercise } from './routes/exercise.js'
import { signs } from './routes/signs.js'
import { user } from './routes/user.js'
import { auth } from './routes/auth.js'

// middleware
app.use(express.json())
app.use(cors())
app.use('/api/exercises', exercise)
app.use('/api/signs', signs)
app.use('/api/user', user)
app.use('/api', auth)

// server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`FLAI app listening at http://localhost:${port}`)
})
