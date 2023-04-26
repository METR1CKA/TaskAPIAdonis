import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ViewValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    ViewValidator:
   *      type: object
   *      properties:
   *        category_id:
   *          type: number
   *        active:
   *          type: boolean
   *        name:
   *          type: string
   *        order_index:
   *          type: number
   *        url:
   *          type: string
   *        description:
   *          type: string
   */
  public schema = schema.create({
    category_id: schema.number([
      rules.required()
    ]),
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
    url: schema.string([
      rules.required(),
      rules.maxLength(100)
    ]),
    description: schema.string([
      rules.required()
    ]),
  })
}
