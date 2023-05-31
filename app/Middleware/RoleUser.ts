import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Role from 'App/Models/Users/Role'

export default class RoleUser {
  public async handle({ auth, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    const role_id = auth.use('api').user?.role_id

    const roles = await Role.getRoles()

    if (role_id >= roles.EDITOR) {
      const json = Service.formatJSON(403, i18n.formatMessage('forbidden'))

      return response.forbidden(json)
    }

    await next()
  }
}
