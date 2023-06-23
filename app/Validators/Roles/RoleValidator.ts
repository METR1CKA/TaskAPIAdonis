import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RoleValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    RoleValidator:
   *      type: object
   *      properties:
   *        name:
   *          type: string
   *        active:
   *          type: boolean
   *        description:
   *          type: string
   *      required:
   *        - name
   *        - active
   */
  public schema = schema.create({
    name: schema.string([
      rules.required()
    ]),
    active: schema.boolean([
      rules.required()
    ]),
    description: schema.string.optional()
  })

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', {
      field: '{{ field }}'
    }),
    string: this.ctx.i18n.formatMessage('field.type', {
      field: '{{ field }}',
      type: '{{ rule }}'
    }),
    boolean: this.ctx.i18n.formatMessage('field.type', {
      field: '{{ field }}',
      type: '{{ rule }}'
    }),
  }
}
