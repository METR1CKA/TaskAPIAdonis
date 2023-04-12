import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class DetectUserLocale extends MessagesI18n {
  public async handle({ request, response, i18n }: HttpContextContract, next: () => Promise<void>) {
    const language = this.getLocaleRequest(request)
    Service.setResponseObject(response)

    if (!language) {
      return Service.httpResponse(400, this.getMessage('lang.error'), {
        locale: this.locale
      })
    }

    i18n.switchLocale(language)
    await this.refreshTranslations()

    await next()
  }
}
