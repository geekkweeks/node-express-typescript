import { NextFunction, Request, Response, Router } from 'express'
import { logger } from '../utils/logger'

export const ProductRouter = Router()

interface Product {
  id: number
  name: string
  desc: string
}

ProductRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  const products: Product[] = []
  products.push({ id: 1, name: 'Product 1', desc: 'Description 1' } as Product)
  products.push({ id: 2, name: 'Product 2', desc: 'Description 2' } as Product)

  res.status(200).send({ message: '', data: products })
})

ProductRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  logger.info('Received POST request at /products')
  res.status(201).send({ message: 'Product created successfully', data: req.body })
})
