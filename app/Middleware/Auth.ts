import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'

export default class AuthMiddleware {
  public header = 'Accept-language'

  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {

    const lang = new MessagesI18n(request.header(this.header))

    const isAuth = await auth.use('api').check()

    if (!isAuth) {
      return response.unauthorized({
        message: lang.getMessage('isNotLogin'),
        data: null
      })
    }

    await next()
  }
}
