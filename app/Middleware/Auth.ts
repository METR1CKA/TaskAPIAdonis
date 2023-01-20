import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'

export default class AuthMiddleware {
  public header = 'Accept-language'

  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {

    Service.locale = request.header(this.header)

    const isAuth = await auth.use('api').check()

    if (!isAuth) {
      return response.unauthorized({
        message: Service.getMessage('isNotLogin'),
        data: null
      })
    }

    await next()
  }
}
