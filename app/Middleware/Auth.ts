import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'

export default class AuthMiddleware {
  public async handle (ctx: HttpContextContract, next: () => Promise<void>) {

    const isCheck = await ctx.auth.use('api').check()

    const isAuthenticated = ctx.auth.isAuthenticated

    const isLoggedIn = ctx.auth.isLoggedIn

    if (!isCheck && !isAuthenticated && !isLoggedIn) {
      const obj = new MessagesI18n(ctx.request.header('Accept-language'))

      return ctx.response.unauthorized({
        message: obj.messageA('messages.errors.noLogin'),
        data: null
      })
    }

    await next()
  }
}
