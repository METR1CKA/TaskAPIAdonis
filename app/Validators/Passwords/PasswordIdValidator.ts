import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordIdValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    newPassword: schema.string([
      rules.required()
    ]),
    confirmPassword: schema.string([
      rules.required(),
      rules.confirmed('newPassword')
    ])
  })

}
