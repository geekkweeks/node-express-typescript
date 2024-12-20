import { Router } from 'express'
import { createProduct, getProducts } from '../controllers/product.controller'

export const ProductRouter = Router()

ProductRouter.get('/', getProducts)
ProductRouter.get('/:name', getProducts)
ProductRouter.post('/', createProduct)
