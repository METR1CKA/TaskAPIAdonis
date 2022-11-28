import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'

export default class PasswordsController {

  public header = 'Accept-Language'

  public async updateAuth({ request, response, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.find(auth.user?.id)

    if (!user) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'user'),
        data: null
      })
    }

    try {

      const vali = await request.validate(PasswordAuthValidator)

      if (!vali) {
        return
      }

      const verify = await Hash.verify(user.password, vali.currentPassword)

      if (!verify) {
        return response.badRequest({
          message: lang.messageA('messages.errors.password'),
          data: {
            verify
          }
        })
      }

      await user.merge({ password: vali.newPassword }).save()

      return response.ok({
        message: lang.messageC('messages.success.update', 'password'),
        data: null
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: {
          error: error.messages
        }
      })

    }

  }

  public async updateId({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'user'),
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
        data: null
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: {
          error: error.messages
        }
      })

    }

  }

}
