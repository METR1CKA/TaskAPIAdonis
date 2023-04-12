import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ViewValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    category_id: schema.number([
      rules.required()
    ]),
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
    url: schema.string([
      rules.required(),
      rules.maxLength(100)
    ]),
    description: schema.string([
      rules.required()
    ]),
  })
}
