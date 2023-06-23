import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
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

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', {
      field: '{{ field }}'
    }),
    maxLength: this.ctx.i18n.formatMessage('maxLength', {
      field: '{{ field }}',
      args: '{{ options.maxLength }}'
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
