import express from 'express'
import dotenv from 'dotenv'
const app = express()

import cors from 'cors'
dotenv.config()
//import routes
import { exercise } from './routes/exercise.js'
import { exerciseSettings } from './routes/exercise_settings.js'
import { exerciseSession } from './routes/exercise_session.js'
import { signs } from './routes/signs.js'
import { signRecording } from './routes/sign_recording.js'
import { user } from './routes/user.js'
import { task } from './routes/task.js'
import { auth } from './routes/auth.js'
import { progress } from './routes/progress.js'
import { statistic } from './routes/statistic.js'

// middleware
app.use(express.json())
app.use(cors())
app.use('/api/exercise', exercise)
app.use('/api/exercise-settings', exerciseSettings)
app.use('/api/exercise-session', exerciseSession)
app.use('/api/sign', signs)
app.use('/api/sign-recording', signRecording)
app.use('/api/user', user)
app.use('/api/task', task)
app.use('/api/progress', progress)
app.use('/api/auth', auth)
app.use('/api/statistic', statistic)

// server
const port = process.env.PORT
app.listen(port, () => {
  console.log(`FLAI app listening at http://localhost:${port}`)
})
