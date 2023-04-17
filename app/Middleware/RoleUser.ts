import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Role from 'App/Models/Users/Role'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class RoleUser extends MessagesI18n {
  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const role_id = auth.use('api').user?.role_id

    const roles = await Role.getRoles()

    if (role_id >= roles.EDITOR) {
      return Service.httpResponse(403, this.getMessage('forbidden'))
    }

    await next()
  }
}
