import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    UpdateValidator:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *        active:
   *          type: boolean
   *        role_id:
   *          type: number
   *        lang_id:
   *          type: number
   *        name:
   *          type: string
   *        lastname:
   *          type: string
   *        phone:
   *          type: string
   *          maxLength: 10
   *        address:
   *          type: string
   *      required:
   *        - email
   *        - active
   *        - role_id
   *        - lang_id
   *        - name
   *        - lastname
   */
  public schema = schema.create({
    email: schema.string([
      rules.required(),
      rules.email()
    ]),
    active: schema.boolean([
      rules.required()
    ]),
    role_id: schema.number([
      rules.required()
    ]),
    lang_id: schema.number([
      rules.required()
    ]),
    name: schema.string([
      rules.required()
    ]),
    lastname: schema.string([
      rules.required()
    ]),
    phone: schema.string.optional([
      rules.maxLength(10)
    ]),
    address: schema.string.optional()
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
