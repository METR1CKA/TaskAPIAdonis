import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
  constructor(protected ctx: HttpContextContract) { }
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
}
