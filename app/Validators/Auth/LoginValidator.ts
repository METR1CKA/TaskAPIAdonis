import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    LoginValidator:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *          format: email
   *        password:
   *          type: string
   *          format: password
   *        remember_me_token:
   *          type: boolean
   */
  public schema = schema.create({
    email: schema.string([
      rules.required(),
      rules.email()
    ]),
    password: schema.string([
      rules.required()
    ]),
    remember_me_token: schema.boolean([
      rules.required()
    ])
  })
}
