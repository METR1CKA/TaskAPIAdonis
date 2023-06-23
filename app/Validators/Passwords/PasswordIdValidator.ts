import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordIdValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    PasswordIdValidator:
   *      type: object
   *      properties:
   *        newPassword:
   *          type: string
   *        confirmPassword:
   *          type: string
   */
  public schema = schema.create({
    newPassword: schema.string([
      rules.required()
    ]),
    confirmPassword: schema.string([
      rules.required(),
      rules.confirmed('newPassword')
    ])
  })

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', {
      field: '{{ field }}'
    }),
    email: this.ctx.i18n.formatMessage('email'),
    maxLength: this.ctx.i18n.formatMessage('maxLength', {
      field: '{{ field }}',
      args: '{{ options.maxLength }}'
    }),
    confirmed: this.ctx.i18n.formatMessage('field.confirm', {
      field: '{{ field }}'
    }),
    string: this.ctx.i18n.formatMessage('field.type', {
      field: '{{ field }}',
      type: '{{ rule }}'
    }),
    number: this.ctx.i18n.formatMessage('field.type', {
      field: '{{ field }}',
      type: '{{ rule }}'
    }),
    boolean: this.ctx.i18n.formatMessage('field.type', {
      field: '{{ field }}',
      type: '{{ rule }}'
    }),
  }
}
