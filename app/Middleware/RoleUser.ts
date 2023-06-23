import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Users/Role'

export default class RoleUser {
  public async handle({ auth, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    const { role_id } = auth.use('api').user!

    const { EDITOR } = await Role.getRoles()

    if (role_id >= EDITOR) {
      return response.forbidden({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('forbidden')
        }
      })
    }

    await next()
  }
}
