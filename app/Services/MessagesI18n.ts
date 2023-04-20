import I18n from '@ioc:Adonis/Addons/I18n'
import Translation from 'App/Models/Translation'
import { string } from '@ioc:Adonis/Core/Helpers'


export default class MessagesI18n {
  public locale = I18n.defaultLocale

  public header = 'Accept-Language'

  public locales = I18n.supportedLocales()

  constructor() {
    return this
  }

  /**
   * If the request has a header called 'Accept-Language', then set the locale to the value of that
   * header.
   * @param {any} request - The request object from the client
   */
  public setLocaleRequest(request: any): void {
    this.locale = request.header(this.header) ?? I18n.defaultLocale
  }

  /**
   * It returns the locale of the request, or null if the locale is not supported
   * @returns The language code of the preferred language.
   */
  public getLocaleRequest(request: any): string | null {
    return request.language(this.locales)
  }

  /**
   * It reloads the translations.
   */
  public async refreshTranslations(): Promise<void> {
    await I18n.loadTranslations()
    await I18n.reloadTranslations()
  }

  /**
    * If the key and context are passed in, return the key with the context formatted. If the key and
    * data are passed in, return the key with the data formatted. If only the key is passed in, return
    * the key formatted
    * @param {string} key - The key of the message you want to translate
    * @param {string} context - The context of the message.
    * @param {any} data - The data of the message
    * @returns The return value is a string.
    */
  public getMessage(key: string, context?: any, data?: any): string {
    if (key && context) {
      return I18n.locale(this.locale).formatMessage(key, {
        data: I18n.locale(this.locale).formatMessage(context)
      })
    }

    if (key && data) {
      return I18n.locale(this.locale).formatMessage(key, data)
    }

    return I18n.locale(this.locale).formatMessage(key)
  }

  /**
   * It takes an error object and returns a string
   * @param {any} Err - any - The error object that is returned from the server
   * @returns The return value is a string.
   */
  public validationErr(Err: any): string {
    const error = Err?.messages?.errors[0]

    const { rule, field } = error

    const lenOrType = (key: string): string => {
      const dataObject = Object.assign(
        { field }, key.includes('Len') ? { args: error?.args?.maxLength } : { type: rule }
      )

      return this.getMessage(key, false, dataObject)
    }

    const valid = {
      email: this.getMessage('email'),
      required: this.getMessage('field', false, { field }),
      confirmed: this.getMessage('field.confirm', false, { field }),
      maxLength: lenOrType('maxLength'),
    }

    return valid[rule] ?? lenOrType('field.type')
  }

  /**
   * This function returns a validation error message based on the type of error and the specified file
   * size and extension names.
   * @param {string} type - a string indicating which type of validation error message to return
   * (either "size", "extname", or "fatal")
   * @param validations - An object containing two properties: { size: string, extnames: string[] }
   * @returns a specific validation message based on the type parameter passed in. The possible values
   * for type are "size", "extname", and "fatal". The function retrieves the corresponding message from
   * the getMessage function and replaces any placeholders with the values provided in the validations
   * parameter.
   */
  public validationErrFile(type: string, validations: { size: string, extnames: string[] }): string {
    const { size } = validations

    const extnames = string.toSentence(validations.extnames, {
      lastSeparator: this.getMessage('and')
    })

    const valid = {
      size: this.getMessage('file.size', false, { size }),
      extname: this.getMessage('file.extnames', false, { extnames }),
      fatal: this.getMessage('file.fatal')
    }

    return valid[type]
  }

  /**
   * This function creates or updates translations in a database based on the provided data and action.
   * @param {any} data - The data parameter is an object that contains the translation keys and
   * messages for a specific locale. It may include a key for the translation name (data.key) and a key
   * for the translation description (data.keyd), along with their corresponding messages (data.name
   * and data.description).
   * @param {'create' | 'update'} action - The `action` parameter is a string that can only have two
   * possible values: `'create'` or `'update'`. It is used to determine whether to create new
   * translations or update existing ones.
   * @returns nothing (undefined) in both cases.
   */
  public async dbTranslations(data: any, action: 'create' | 'update') {
    if (action == 'update') {
      await Translation.query().where({ key: data.key, locale: this.locale })
        .update({ message: data.name })

      await Translation.query().where({ key: data.keyd, locale: this.locale })
        .update({ message: data.description })

      return
    }

    const keys_name = this.locales.map(locale => {
      return {
        locale,
        key: data.key,
        message: data.name
      }
    })

    const keys_desc = this.locales.map(locale => {
      return {
        locale,
        key: data.keyd,
        message: data.description
      }
    })

    await Translation.createMany(keys_name)
    await Translation.createMany(keys_desc)

    return
  }
}
