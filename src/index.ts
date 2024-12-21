import express, { NextFunction, Request, Response, Application } from 'express'
import { routes } from './routes'
import { logger } from './utils/logger'
import bodyParser from 'body-parser'
import cors from 'cors'

// Connect to MongoDB
import './utils/connectDB'

// Cron job
import './cron'

const app: Application = express()
const port: Number = process.env.PORT != null ? parseInt(process.env.PORT) : 4000

// parser body request
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Cors access handler
app.use(cors())
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', '*')
  res.setHeader('Access-Control-Allow-Headers', '*')
  next()
})

routes(app)

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`)
})
