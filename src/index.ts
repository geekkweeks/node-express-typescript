import express, { NextFunction, Request, Response, Application } from 'express'

import 'dotenv/config'

const app: Application = express()
const port: number = process.env.PORT != null ? parseInt(process.env.PORT) : 3000

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello, World! UIO')
})
app.get('/health', (req: Request, res: Response, next: NextFunction) => {
  const result = { data: 'Health' }
  res.send(result).status(200)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
