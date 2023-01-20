import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'
import Service from '@ioc:Adonis/Providers/Services'

export default class PasswordsController {

  public header = 'Accept-Language'

  public async updateAuth({ request, response, auth }: HttpContextContract) {

    Service.locale = request.header(this.header)

    const user = await User.find(auth.user?.id)

    if (!user) {
      return response.notFound({
        message: Service.getMessage('notFound'),
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
          message: Service.getMessage('password.error'),
          data: {
            verify
          }
        })
      }

      await user.merge({ password: vali.newPassword }).save()

      return response.ok({
        message: Service.getMessage('updated'),
        data: null
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: Service.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

  public async updateId({ request, response, params }: HttpContextContract) {

    Service.locale = request.header(this.header)

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: Service.getMessage('notFound'),
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
        message: Service.getMessage('updated'),
        data: null
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: Service.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

}
