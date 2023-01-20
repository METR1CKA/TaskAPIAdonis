import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Users/Role'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class RoleUser extends MessagesI18n {

  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {

    const role_id = await auth.use('api').user?.role_id

    if (role_id >= Role.ROLES.EDITOR) {

      this.locale = request.header(this.header)

      return response.forbidden({
        messages: this.getMessage('forbidden'),
        data: null
      })

    }

    await next()

  }
}
