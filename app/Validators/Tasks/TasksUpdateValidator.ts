import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TasksUpdateValidator {
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
    ]),
    completed: schema.boolean([
      rules.required()
    ])
  })
}
