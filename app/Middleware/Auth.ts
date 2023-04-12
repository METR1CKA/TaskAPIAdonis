import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class AuthMiddleware extends MessagesI18n {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    if (!await auth.use('api').check()) {
      return Service.httpResponse(401, this.getMessage('isNotLogin'), {
        isAuthenticated: auth.use('api').isAuthenticated
      })
    }

    await next()
  }
}
