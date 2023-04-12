import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RolesViewValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    views: schema.array().members(schema.number([
      rules.required(),
    ])),
    active: schema.boolean([
      rules.required(),
    ]),
  })
}
