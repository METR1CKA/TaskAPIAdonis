import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
  public async handle({ auth, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    if (!await auth.use('api').check()) {
      const { isAuthenticated } = auth.use('api')

      return response.unauthorized({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('isNotLogin'),
          isAuthenticated
        }
      })
    }

    await next()
  }
}
