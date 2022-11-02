import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import Role from 'App/Models/Users/Role'

export default class RoleUser {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    const role_id = await auth.use('api').user?.role_id

    if (role_id >= Role.ROLES.EDITOR) {
      const obj = new MessagesI18n(request.header('Accept-language'))

      const message = obj.format(
        obj.messageA('messages.errors.noAccess'),
        obj.messageA('messages.FAILED'),
        null
      )

      return response.forbidden(message)
    }

    await next()
  }
}
