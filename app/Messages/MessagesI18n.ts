import I18n from '@ioc:Adonis/Addons/I18n'

export default class MessagesI18n {

  private locale: any

  constructor (locale: any) {
    this.locale = locale
  }

  public messageA(key: string) {
    return I18n.locale(this.locale).formatMessage(key)
  }

  public messageB(key: string, data: any) {
    return I18n.locale(this.locale).formatMessage(key, data)
  }

  public messageC(key: string, context: string) {
    return I18n.locale(this.locale).formatMessage(key, {
      data: I18n.locale(this.locale).formatMessage(context)
    })
  }

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