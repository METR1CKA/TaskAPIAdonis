import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordAuthValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    PasswordAuthValidator:
   *      type: object
   *      properties:
   *        currentPassword:
   *          type: string
   *        newPassword:
   *          type: string
   *        confirmPassword:
   *          type: string
   */
  public schema = schema.create({
    currentPassword: schema.string([
      rules.required()
    ]),
    newPassword: schema.string([
      rules.required()
    ]),
    confirmPassword: schema.string([
      rules.required(),
      rules.confirmed('newPassword')
    ])
  })
}
