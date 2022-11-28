import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract, } from '@ioc:Adonis/Core/HttpContext'

export default class TaskValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user_id: schema.number([
      rules.required()
    ]),
    title: schema.string([
      rules.required()
    ]),
    description: schema.string([
      rules.required()
    ])
  })

}
