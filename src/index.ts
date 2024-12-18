import express, {
  type NextFunction,
  type Request,
  type Response,
  type Application
} from 'express'

import 'dotenv/config'

const app: Application = express()
const port: number =
  process.env.PORT != null ? parseInt(process.env.PORT) : 3000

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Hello, World!dsd')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
