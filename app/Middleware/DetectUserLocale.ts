import I18n from '@ioc:Adonis/Addons/I18n'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class DetectUserLocale {
  public async handle({ request, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    const lang = request.language(I18n.supportedLocales())

    if (!lang) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('lang.error')
        }
      })
    }

    i18n.switchLocale(lang)

    await next()
  }
}
