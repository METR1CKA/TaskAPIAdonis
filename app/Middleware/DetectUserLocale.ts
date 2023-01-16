import I18n from '@ioc:Adonis/Addons/I18n'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class DetectUserLocale {

  protected getUserLanguage({ request }: HttpContextContract) {
    return request.language(I18n.supportedLocales()) || request.input('lang')
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const language = this.getUserLanguage(ctx)

    if (!language) {
      const lang = new MessagesI18n(I18n.defaultLocale)

      return ctx.response.badRequest({
        message: lang.getMessage('lang.error'),
        data: null
      })
    }

    ctx.i18n.switchLocale(language)

    await next()
  }
}
