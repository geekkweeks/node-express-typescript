import { NextFunction, Request, Response } from 'express'
import { createProductValidationSchema } from '../validations/product.validation'
import { logger } from '../utils/logger'
import { getProductService } from '../services/product.service'

interface ProductType {
  product_id: Number
  name: String
  price: Number
  description: String
}

// export const getProducts = (req: Request, res: Response, next: NextFunction) => {
//   const products: Product[] = []
//   products.push({ id: 1, name: 'Xbox', desc: 'Description 1' } as Product)
//   products.push({ id: 2, name: 'PS4', desc: 'Description 2' } as Product)
//   products.push({ id: 3, name: 'Laptop', desc: 'Description 1' } as Product)
//   products.push({ id: 4, name: 'Iphone 15', desc: 'Description 2' } as Product)

//   const {
//     params: { name }
//   } = req

//   if (name) {
//     const filterProducts = products.filter((product) => {
//       if (product.name === name) return product
//     })
//     logger.info(`Filtered products by name: ${name}`)
//     if (filterProducts.length === 0) {
//       console.log('🚀 ~ getProducts ~ filterProducts.length:', filterProducts.length)
//       res.status(404).send({ message: 'Product not found', data: [] })
//     }
//     res.status(200).send({ message: '', data: filterProducts[0] })
//   }

//   res.status(200).send({ message: '', data: products })
// }

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  const {
    params: { name }
  } = req
  const products: any = await getProductService()

  if (name) {
    console.log('🚀 ~ getProducts ~ name:', name)
    const filterProducts = products.filter((product: ProductType) => {
      if (product.name === name) return product
    })
    logger.info(`Filtered products by name: ${name}`)
    if (filterProducts.length === 0) {
      console.log('🚀 ~ getProducts ~ filterProducts.length:', filterProducts.length)
      res.status(404).send({ message: 'Product not found', data: [] })
    }
    res.status(200).send({ message: '', data: filterProducts[0] })
  }

  res.status(200).send({ message: '', data: products })
}

export const createProduct = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = createProductValidationSchema(req.body)
  if (error) {
    logger.error(`Product Validation error: ${error.details[0].message}`)
    res.status(422).send({ message: error.details[0].message, data: null })
  }

  res.status(201).send({ message: 'Product created successfully', data: value })
}
