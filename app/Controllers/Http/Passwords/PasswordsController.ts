import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'

export default class PasswordsController {

  public async updateAuth({ request, response, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header('Accept-language'))

    const user = await User.find(auth.user?.id)

    if (!user) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'user'),
        status: lang.messageA('messages.FAILED'),
        data: null
      })
    }

    try {

      const vali = await request.validate(PasswordAuthValidator)

      if (!vali) {
        return
      }

      if (!await Hash.verify(user.password, vali.currentPassword)) {
        return response.badRequest({
          message: lang.messageA('messages.errors.password'),
          status: lang.messageA('messages.FAILED'),
          data: null
        })
      }

      await user.merge({ password: vali.newPassword }).save()

      return response.ok({
        message: lang.messageC('messages.success.update', 'password'),
        status: lang.messageA('messages.SUCCESSFUL'),
        data: null
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        status: lang.messageA('messages.FAILED'),
        data: error.messages
      })

    }

  }

  public async updateId({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header('Accept-language'))

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'user'),
        status: lang.messageA('messages.FAILED'),
        data: null
      })
    }

    try {

      const vali = await request.validate(PasswordIdValidator)

      if (!vali) {
        return
      }

      await user.merge({ password: vali.newPassword }).save()

      return response.ok({
        message: lang.messageC('messages.success.update', 'password'),
        status: lang.messageA('messages.SUCCESSFUL'),
        data: null
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        status: lang.messageA('messages.FAILED'),
        data: error.messages
      })

    }

  }

}
