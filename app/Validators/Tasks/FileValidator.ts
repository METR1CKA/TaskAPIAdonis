import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
export default class FileValidator {
  constructor(protected ctx: HttpContextContract) { }

  public schema = schema.create({
    file: schema.file.optional(
      Service.getFileValidations()
    )
  })

  public messages: CustomMessages = {
    'file.size': this.ctx.i18n.formatMessage('file.size', {
      size: '{{ options.size }}'
    }),
    'file.extname': this.ctx.i18n.formatMessage('file.extnames', {
      extnames: '{{ options.extnames }}'
    }),
  }
}
