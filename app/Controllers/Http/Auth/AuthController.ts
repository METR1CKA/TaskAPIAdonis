import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'

export default class AuthController {

  public header = 'Accept-Language'

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
          message: lang.messageC('messages.errors.notFound', 'role'),
          data: null
        })
      }

      const existUser = await User.findBy('email', vali.email)

      if (existUser) {
        return response.badRequest({
          messages: lang.messageA('messages.errors.exist'),
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

      const profile = await Profile.create(
        {
          user_id: user.id,
          name: vali.name,
          lastname: vali.lastname,
          phone: vali.phone,
          address: vali.address
        }
      )

      return response.created({
        message: lang.messageC('messages.success.create', 'user'),
        data: {
          user,
          profile
        }
      })

    } catch (error) {

      console.log(error)

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
            message: lang.messageC('messages.errors.notFound', 'user'),
            data: null
          })
        }

        const token = await auth.use('api').attempt(vali.email, vali.password, {
          expiresIn: '1year'
        })

        return response.ok({
          message: lang.messageA('messages.success.login'),
          data: {
            auth: {
              type: token.type,
              token: token.token,
              expires_at: token.expiresAt?.toFormat('dd/MM/yyyy  HH:mm:ss')
            }
          }
        })

      } catch (error) {

        console.log(error)

        return response.badRequest({
          message: lang.messageA('messages.errors.login'),
          data: {
            responseText: error?.responseText
          }
        })

      }
    } catch (error) {

      console.log(error)

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

    await auth.use('api').revoke()

    return response.ok({
      message: lang.messageA('messages.success.logout'),
      data: {
        revoke: true
      }
    })

  }

  public async me({ response, request, auth }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.query()
      .where(
        {
          id: auth.user?.id,
          email: auth.user?.email
        }
      )
      .preload('profile')
      .preload('role')
      .firstOrFail()

    return response.ok({
      message: lang.messageA('messages.success.authUser'),
      data: {
        user
      }
    })

  }
}
