import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
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

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', { field: '{{ field }}' }),
    email: this.ctx.i18n.formatMessage('email'),
    string: this.ctx.i18n.formatMessage('field.type', { field: '{{ field }}', type: '{{ rule }}' }),
    boolean: this.ctx.i18n.formatMessage('field.type', { field: '{{ field }}', type: '{{ rule }}' }),
  }
}
