import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class PasswordsController extends MessagesI18n {

  public async updateAuth({ request, response, auth }: HttpContextContract) {

    this.locale = request.header(this.header)

    const user = await User.find(auth.user?.id)

    if (!user) {
      return response.notFound({
        message: this.getMessage('notFound'),
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
          message: this.getMessage('password.error'),
          data: {
            verify
          }
        })
      }

      await user.merge({ password: vali.newPassword }).save()

      return response.ok({
        message: this.getMessage('updated'),
        data: null
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: this.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

  public async updateId({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: this.getMessage('notFound'),
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
        message: this.getMessage('updated'),
        data: null
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: this.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

}
