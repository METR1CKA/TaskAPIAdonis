import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {

    await auth.use('api').check()

    if (!auth.isAuthenticated) {
      return response.unauthorized({})
    }

    await next()
  }
}
