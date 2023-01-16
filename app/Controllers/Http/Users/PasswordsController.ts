import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'
import ExceptionHandler from 'App/Exceptions/Handler'

export default class PasswordsController {

  public header = 'Accept-Language'
  public exception = new ExceptionHandler()

  public async updateAuth({ request, response, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.find(auth.user?.id)

    if (!user) {
      return response.notFound({
        message: lang.getMessage('notFound'),
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
          message: lang.getMessage('password.error'),
          data: {
            verify
          }
        })
      }

      await user.merge({ password: vali.newPassword }).save()

      return response.ok({
        message: lang.getMessage('updated'),
        data: null
      })

    } catch (error) {

      this.exception.devLogs(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

  public async updateId({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: lang.getMessage('notFound'),
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
        message: lang.getMessage('updated'),
        data: null
      })

    } catch (error) {

      this.exception.devLogs(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

}
