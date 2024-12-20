import { NextFunction, Request, Response, Router } from 'express'
import { createProductValidationSchema } from '../validation/product.validation'
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
  const { error, value } = createProductValidationSchema(req.body)
  if (error) {
    logger.error(`Product Validation error: ${error.details[0].message}`)
    res.status(422).send({ message: error.details[0].message, data: null })
  }

  res.status(201).send({ message: 'Product created successfully', data: value })
})
