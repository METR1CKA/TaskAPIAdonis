import { schema, rules, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) { }
  /**
   * @swagger
   * components:
   *  schemas:
   *    RegisterValidator:
   *      type: object
   *      properties:
   *        email:
   *          type: string
   *        password:
   *          type: string
   *        active:
   *          type: boolean
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
   *        - password
   *        - active
   *        - lang_id
   *        - name
   *        - lastname
   */
  public schema = schema.create({
    email: schema.string([
      rules.required(),
      rules.email(),
      rules.maxLength(255)
    ]),
    password: schema.string([
      rules.required(),
      rules.maxLength(200)
    ]),
    lang_id: schema.number([
      rules.required()
    ]),
    name: schema.string([
      rules.required(),
      rules.maxLength(200)
    ]),
    lastname: schema.string([
      rules.required(),
      rules.maxLength(200)
    ]),
    phone: schema.string.optional([
      rules.maxLength(10)
    ]),
    address: schema.string.optional()
  })

  public messages: CustomMessages = {
    required: this.ctx.i18n.formatMessage('field', { field: '{{ field }}' }),
    email: this.ctx.i18n.formatMessage('email'),
    maxLength: this.ctx.i18n.formatMessage('maxLength', { field: '{{ field }}', args: '{{ options.maxLength }}' }),
    confirmed: this.ctx.i18n.formatMessage('field.confirm', { field: '{{ field }}' }),
    string: this.ctx.i18n.formatMessage('field.type', { field: '{{ field }}', type: '{{ rule }}' }),
    number: this.ctx.i18n.formatMessage('field.type', { field: '{{ field }}', type: '{{ rule }}' }),
  }
}
