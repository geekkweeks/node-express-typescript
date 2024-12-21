import { errors } from './../../node_modules/@sideway/address/lib/index.d'
import { logger } from '../utils/logger'
import productModel from '../models/product.model'

export const getProductService = async () => {
  return await productModel
    .find()
    .then((data) => {
      return data
    })
    .catch((error) => {
      logger.error(error)
    })
}
