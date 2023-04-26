import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract, } from '@ioc:Adonis/Core/HttpContext'

export default class TaskValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    TaskValidator:
   *      type: object
   *      properties:
   *        title:
   *          type: string
   *        description:
   *          type: string
   */
  public schema = schema.create({
    title: schema.string([
      rules.required()
    ]),
    description: schema.string([
      rules.required()
    ])
  })
}
