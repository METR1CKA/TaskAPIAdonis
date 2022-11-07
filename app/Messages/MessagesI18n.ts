import I18n from '@ioc:Adonis/Addons/I18n'

export default class MessagesI18n {

  /* A private property of the class. */
  private locale: any

  /**
   * A constructor function.
   * @param {any} locale - The locale to use.
   */
  constructor (locale: any) {
    this.locale = locale
  }

  /**
   * It takes a string as an argument, and returns a string
   * @param {string} key - The key of the message to be translated.
   * @returns The value of the key in the locale file.
   */
  public messageA(key: string) {
    return I18n.locale(this.locale).formatMessage(key)
  }

  /**
   * It takes a key and data, and returns a formatted message
   * @param {string} key - The key of the message to be translated.
   * @param {any} data - The data object that will be used to replace the placeholders in the message.
   * @returns The return value is a string.
   */
  public messageB(key: string, data: any) {
    return I18n.locale(this.locale).formatMessage(key, data)
  }

  /**
   * It takes a key and a context, and returns the translation of the key, with the translation of the
   * context as a data object
   * @param {string} key - the key of the message you want to translate
   * @param {string} context - The context of the message.
   * @returns The value of the key in the locale file.
   */
  public messageC(key: string, context: string) {
    return I18n.locale(this.locale).formatMessage(key, {
      data: I18n.locale(this.locale).formatMessage(context)
    })
  }

  /**
   * It takes an error object and returns a string
   * @param {any} Err - any - The error object that is returned from the server
   * @returns The return value is a string.
   */
  public validationErr (Err: any) {
    const rule = Err.messages.errors[0].rule
    const field = Err.messages.errors[0].field

    if(rule == 'email') {
      return this.messageA('messages.errors.email')
    }

    if (rule == 'required') {
      return this.messageB('messages.errors.field', {field})
    }

    if(rule == 'confirmed') {
      return this.messageB('messages.errors.confirm', {field})
    }

    if (rule == 'maxLength') {
      const args = Err.messages.errors[0].args.maxLength

      return this.messageB('messages.errors.maxLength', {field, args})
    }

    return this.messageB('messages.errors.rule', {field, type: rule})
  }
}