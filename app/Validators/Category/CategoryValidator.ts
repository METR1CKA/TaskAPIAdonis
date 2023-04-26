import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    CategoryValidator:
   *      type: object
   *      properties:
   *        active:
   *          type: boolean
   *        name:
   *          type: string
   *          maxLength: 100
   *        order_index:
   *          type: number
   *        description:
   *          type: string
   */
  public schema = schema.create({
    active: schema.boolean([
      rules.required()
    ]),
    name: schema.string([
      rules.required(),
      rules.maxLength(100)
    ]),
    order_index: schema.number([
      rules.required()
    ]),
    description: schema.string([
      rules.required()
    ]),
  })
}
