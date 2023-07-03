import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordValidator {
  constructor(protected ctx: HttpContextContract) { }

  /**
   * @swagger
   * components:
   *  schemas:
   *    PasswordValidator:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *      required:
   *        - email
   */
  public schema = schema.create({
    email: schema.string([
      rules.required()
    ])
  })

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', {
      field: '{{ field }}'
    }),
    string: this.ctx.i18n.formatMessage('field.type', {
      field: '{{ field }}',
      type: '{{ rule }}'
    }),
    email: this.ctx.i18n.formatMessage('email')
  }
}
