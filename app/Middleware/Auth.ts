import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'

export default class AuthMiddleware {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {

    const isLogged = await ctx.auth.use('api').check()

    if (!ctx.auth.isAuthenticated && ! isLogged) {
      const obj = new MessagesI18n(ctx.request.header('Accept-language'))

      return ctx.response.unauthorized({
        message: obj.messageA('messages.errors.noLogin'),
        status: obj.messageA('messages.FAILED'),
        data: null
      })
    }

    await next()
  }
}
