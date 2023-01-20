import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class AuthMiddleware extends MessagesI18n {

  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {

    this.locale = request.header(this.header)

    const isAuth = await auth.use('api').check()

    if (!isAuth) {
      return response.unauthorized({
        message: this.getMessage('isNotLogin'),
        data: null
      })
    }

    await next()
  }
}
