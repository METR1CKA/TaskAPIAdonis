import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import ExceptionHandler from 'App/Exceptions/Handler'
import ApiToken from 'App/Models/Users/ApiToken'

export default class AuthController {

  public header = 'Accept-Language'
  public exception = new ExceptionHandler()

  public async register({ response, request }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    try {

      const vali = await request.validate(RegisterValidator)

      if (!vali) {
        return
      }

      const role = await Role.find(vali.role_id)

      if (!role) {
        return response.notFound({
          message: lang.getMessage('notFound'),
          data: null
        })
      }

      const existUser = await User.findBy('email', vali.email)

      if (existUser) {
        return response.badRequest({
          messages: lang.getMessage('user.exists'),
          data: null
        })
      }

      const user = await User.create(
        {
          email: vali.email,
          password: vali.password,
          active: vali.active,
          role_id: vali.role_id
        }
      )

      await Profile.create(
        {
          user_id: user.id,
          name: vali.name,
          lastname: vali.lastname,
          phone: vali.phone,
          address: vali.address
        }
      )

      return response.created({
        message: lang.getMessage('created'),
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

  public async login({ response, request, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    try {

      const vali = await request.validate(LoginValidator)

      if (!vali) {
        return
      }

      try {

        const verify = await auth.use('api').verifyCredentials(vali.email, vali.password)

        if (!verify) {
          return
        }

        const user = await User.findBy('email', vali.email)

        if (!user) {
          return response.notFound({
            message: lang.getMessage('notFound'),
            data: null
          })
        }

        const token = await auth.use('api').attempt(vali.email, vali.password, {
          expiresIn: '1year'
        })

        return response.ok({
          message: lang.getMessage('login'),
          data: {
            auth: {
              type: token.type,
              token: token.token,
              expires_at: token.expiresAt?.toFormat('dd/MM/yyyy  HH:mm:ss')
            }
          }
        })

      } catch (error) {

        this.exception.devLogs(error)

        return response.badRequest({
          message: lang.getMessage('login.error'),
          data: {
            responseText: error?.responseText
          }
        })

      }
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

  public async logout({ response, request, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    await ApiToken.query().where('user_id', auth.user?.id).delete()

    return response.ok({
      message: lang.getMessage('logout'),
      data: {
        revoke: true
      }
    })

  }

  public async me({ response, request, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.query()
      .where({ id: auth.user?.id, email: auth.user?.email })
      .preload('profile')
      .preload('role')
      .firstOrFail()

    return response.ok({
      message: lang.getMessage('auth.user'),
      data: user
    })

  }
}
