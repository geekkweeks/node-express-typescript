import Joi from 'joi'

interface ProductInterface {
  name: String
  price: Number
}

export const createProductValidationSchema = (payload: ProductInterface) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().allow('', null)
  })

  return schema.validate(payload)
}
