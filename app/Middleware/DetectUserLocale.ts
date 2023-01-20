import I18n from '@ioc:Adonis/Addons/I18n'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class DetectUserLocale extends MessagesI18n {

  protected getUserLanguage({ request }: HttpContextContract) {
    return request.language(I18n.supportedLocales()) || request.input('lang')
  }

  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    const language = this.getUserLanguage(ctx)

    if (!language) {
      this.locale = I18n.defaultLocale

      return ctx.response.badRequest({
        message: this.getMessage('lang.error'),
        data: null
      })
    }

    ctx.i18n.switchLocale(language)

    await next()
  }
}
