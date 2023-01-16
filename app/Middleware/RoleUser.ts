import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import Role from 'App/Models/Users/Role'

export default class RoleUser {

  public header = 'Accept-language'

  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {

    const role_id = await auth.use('api').user?.role_id

    if (role_id >= Role.ROLES.EDITOR) {

      const lang = new MessagesI18n(request.header(this.header))

      return response.forbidden({
        messages: lang.getMessage('forbidden'),
        data: null
      })

    }

    await next()

  }
}
