import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegisterValidator {
  constructor(protected ctx: HttpContextContract) {}
  public schema = schema.create({
    email: schema.string([
      rules.required(),
      rules.email()
    ]),
    password: schema.string([
      rules.required()
    ]),
    active: schema.boolean([
      rules.required()
    ]),
    role_id: schema.number([
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
}
