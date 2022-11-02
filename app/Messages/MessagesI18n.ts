import I18n from '@ioc:Adonis/Addons/I18n'

export default class MessagesI18n {
  private locale: any

  constructor (locale: any) {
    this.locale = locale
  }

  public format(message: string, status: string, data: any) {
    return {
      message,
      status,
      data
    }
  }

  public messageA(key: string) {
    return I18n.locale(this.locale).formatMessage(key)
  }

  public messageB(key: string, data: any) {
    return I18n.locale(this.locale).formatMessage(key, data)
  }

  public validationErr (Err: any) {
    const rule = Err.messages.errors[0].rule
    const field = Err.messages.errors[0].field

    if(rule == 'email') {
      return this.messageA('')
    }

    if (rule == 'required') {
      return this.messageB('', {field})
    }

    if(rule == 'confirmed') {
      return this.messageB('', {field})
    }

    if (rule == 'maxLength') {
      const args = Err.messages.errors[0].args.maxLength

      return this.messageB('', {field, args})
    }

    return this.messageB('', {field, type: rule})
  }
}