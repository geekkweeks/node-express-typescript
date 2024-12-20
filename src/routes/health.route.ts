import { NextFunction, Request, Response, Router } from 'express'

export const HealthRouter = Router()

HealthRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ data: 'Health' })
})
