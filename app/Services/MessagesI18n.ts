import I18n from '@ioc:Adonis/Addons/I18n'

export default class MessagesI18n {

  /* A private property of the class. */
  public locale: any

  /* A public property of the class. */
  public header = 'Accept-Language'

  constructor() {
    return this
  }

  /**
    * If the key and context are passed in, return the key with the context formatted. If the key and
    * data are passed in, return the key with the data formatted. If only the key is passed in, return
    * the key formatted
    * @param {string} key - The key of the message you want to translate
    * @param {string} [context] - The context of the message.
    * @param {any} [data] - The data of the message
    * @returns The return value is a string.
    */
  public getMessage(key: string, context?: string, data?: any) {

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
  public validationErr(Err: any) {
    const rule = Err.messages.errors[0].rule
    const field = Err.messages.errors[0].field

    if (rule == 'email') {
      return this.getMessage('email')
    }

    if (rule == 'required') {
      return this.getMessage('field', undefined, { field })
    }

    if (rule == 'confirmed') {
      return this.getMessage('field.confirm', undefined, { field })
    }

    if (rule == 'maxLength') {
      const args = Err.messages.errors[0].args.maxLength

      return this.getMessage('maxLength', undefined, { field, args })
    }

    return this.getMessage('field.type', undefined, { field, type: rule })
  }
}