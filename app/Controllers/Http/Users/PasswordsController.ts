import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/Users/User'
import Hash from '@ioc:Adonis/Core/Hash'
import PasswordAuthValidator from 'App/Validators/Passwords/PasswordAuthValidator'
import PasswordIdValidator from 'App/Validators/Passwords/PasswordIdValidator'
import Service from '@ioc:Adonis/Providers/Services'
import PasswordValidator from 'App/Validators/Passwords/PasswordValidator'
import Env from '@ioc:Adonis/Core/Env'

export default class PasswordsController {
  /**
   * @swagger
   * components:
   *  requestBodies:
   *    PasswordUpdateAuthRequest:
   *      description: Data for update password of users
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/PasswordAuthValidator'
   */
  public async updateAuth({ request, response, auth, i18n }: HttpContextContract) {
    try {
      await request.validate(PasswordAuthValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: error.message
        }
      })
    }

    const { id } = auth.use('api').user!

    const user = await User.find(id)

    if (!user) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound')
        }
      })
    }

    const { currentPassword, newPassword } = request.body()

    const isCorrectPassword = await Hash.verify(user.password, currentPassword)

    if (!isCorrectPassword) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('password.error'),
          isCorrectPassword
        }
      })
    }

    await user.merge({ password: newPassword }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('updated')
      }
    })
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    PasswordUpdateIdRequest:
   *      description: Data for update password of users by id
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/PasswordIdValidator'
   */
  public async updateId({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(PasswordIdValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: error.message,
        }
      })
    }

    const { newPassword } = request.body()

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'User'
        }
      })
    }

    await user.merge({ password: newPassword }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('updated')
      }
    })
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    PasswordUpdateRequest:
   *      description: Data for update default password to users by email
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/PasswordValidator'
   */
  public async updateDefault({ request, response, i18n }: HttpContextContract) {
    try {
      await request.validate(PasswordValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation?.messages)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: error?.message
        }
      })
    }

    const { email } = request.body()

    const user = await User.findBy('email', email)

    if (!user) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'User'
        }
      })
    }

    await user.merge({ password: Env.get('PASSWORD_DEFAULT') }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('updated'),
      }
    })
  }
}
