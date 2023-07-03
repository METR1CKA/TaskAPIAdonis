import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
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
   *      required:
   *        - currentPassword
   *        - newPassword
   *        - confirmPassword
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

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', {
      field: '{{ field }}'
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
