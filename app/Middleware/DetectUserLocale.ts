import I18n from '@ioc:Adonis/Addons/I18n'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'

export default class DetectUserLocale {
  public async handle({ request, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    const lang = request.language(I18n.supportedLocales())

    if (!lang) {
      const json = Service.formatJSON(400, i18n.formatMessage('lang.error'))

      return response.badRequest(json)
    }

    i18n.switchLocale(lang)

    await I18n.loadTranslations()
    await I18n.reloadTranslations()

    await next()
  }
}
