import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'

export default class AuthMiddleware {
  public async handle({ auth, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    if (!await auth.use('api').check()) {
      const json = Service.formatJSON(401, i18n.formatMessage('isNotLogin'), {
        isAuthenticated: auth.use('api').isAuthenticated
      })

      return response.unauthorized(json)
    }

    await next()
  }
}
