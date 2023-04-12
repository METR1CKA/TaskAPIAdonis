import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class PasswordsController extends MessagesI18n {
  public async updateAuth({ request, response, auth }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const user = await User.find(auth.user?.id)

    if (!user) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'User'
      })
    }

    try {
      var authPasswords = await request.validate(PasswordAuthValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { currentPassword, newPassword } = authPasswords

    const isCorrectPassword = await Hash.verify(user.password, currentPassword)

    if (!isCorrectPassword) {
      return Service.httpResponse(400, this.getMessage('password.error'), { isCorrectPassword })
    }

    await user.merge({ password: newPassword }).save()

    return Service.httpResponse(200, this.getMessage('updated'))
  }

  public async updateId({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const user = await User.find(params.id)

    if (!user) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'User'
      })
    }

    try {
      var idPasswords = await request.validate(PasswordIdValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    await user.merge({ password: idPasswords.newPassword }).save()

    return Service.httpResponse(200, this.getMessage('updated'))
  }
}
