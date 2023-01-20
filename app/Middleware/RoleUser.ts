import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Role from 'App/Models/Users/Role'

export default class RoleUser {

  public header = 'Accept-language'

  public async handle({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {

    const role_id = await auth.use('api').user?.role_id

    if (role_id >= Role.ROLES.EDITOR) {

      Service.locale = request.header(this.header)

      return response.forbidden({
        messages: Service.getMessage('forbidden'),
        data: null
      })

    }

    await next()

  }
}
