import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RolesViewValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    RolesViewsValidator:
   *      type: object
   *      properties:
   *        views:
   *          type: array
   *          items:
   *            type: number
   */
  public schema = schema.create({
    views: schema.array().members(schema.number([
      rules.required(),
    ])),
  })

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', {
      field: '{{ field }}'
    }),
    number: this.ctx.i18n.formatMessage('field.type', {
      field: 'views',
      type: '{{ rule }}'
    }),
  }
}
