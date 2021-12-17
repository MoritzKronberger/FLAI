// hello world from https://expressjs.com/de/starter/hello-world.html
import express from 'express'

const app = express()
const port = process.env.PORT

app.listen(port, () => {
  console.log(`FLAI app listening at http://localhost:${port}`)
})
