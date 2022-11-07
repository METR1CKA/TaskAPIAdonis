import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import Hash from '@ioc:Adonis/Core/Hash'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'

export default class AuthController {

  public async register({ response, request }: HttpContextContract) {

    const obj = new MessagesI18n(request.header('Accept-language'))

    try {

      const vali = await request.validate(RegisterValidator)

      if (!vali) {
        return
      }

      const role = await Role.find(vali.role_id)

      if (!role) {
        return response.notFound({
          message: obj.messageC('messages.errors.notFound', 'role'),
          status: obj.messageA('messages.FAILED'),
          data: null
        })
      }

      const existUser = await User.findBy('email', vali.email)

      if (existUser) {
        return response.badRequest({
          messages: obj.messageA('messages.errors.exist'),
          status: obj.messageA('messages.FAILED'),
          data: null
        })
      }

      const user = await User.create(
        {
          'email': vali.email,
          'password': vali.password,
          'active': vali.active,
          'role_id': vali.role_id
        }
      )

      const profile = await Profile.create(
        {
          'user_id': user.id,
          'name': vali.name,
          'lastname': vali.lastname,
          'phone': vali.phone,
          'address': vali.address
        }
      )

      return response.created({
        message: obj.messageC('messages.success.create', 'user'),
        status: obj.messageA('messages.SUCCESSFUL'),
        data: {
          user,
          profile
        }
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: obj.validationErr(error),
        status: obj.messageA('messages.FAILED'),
        data: error.messages
      })

    }
  }

  public async login({ response, request, auth }: HttpContextContract) {

    const obj = new MessagesI18n(request.header('Accept-language'))

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
            message: obj.messageC('messages.errors.notFound', 'user'),
            status: obj.messageA('messages.FAILED'),
            data: null
          })
        }

        if (!await Hash.verify(user.password, vali.password)) {
          return response.unauthorized({
            message: obj.messageA('messages.errors.password'),
            status: obj.messageA('messages.FAILED'),
            data: null
          })
        }

        const token = await auth.use('api').attempt(vali.email, vali.password, {
          expiresIn: '1year'
        })

        return response.ok({
          message: obj.messageA('messages.success.login'),
          status: obj.messageA('messages.SUCCESSFUL'),
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
          message: obj.messageA('messages.errors.login'),
          status: obj.messageA('messages.FAILED'),
          data: error
        })

      }
    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: obj.validationErr(error),
        status: obj.messageA('messages.FAILED'),
        data: error.messages
      })

    }
  }

  public async logout({ response, request, auth }: HttpContextContract) {

    const obj = new MessagesI18n(request.header('Accept-language'))

    await auth.use('api').revoke()

    return response.ok({
      message: obj.messageA('messages.success.logout'),
      status: obj.messageA('messages.SUCCESSFUL'),
      data: null
    })

  }

  public async me({ response, request, auth }: HttpContextContract) {

    const obj = new MessagesI18n(request.header('Accept-language'))

    const user = await User.query()
      .where('id', auth.use('api').user?.id)
      .preload('profile')
      .preload('role')
      .firstOrFail()

    return response.ok({
      message: obj.messageA('messages.success.authUser'),
      status: obj.messageA('messages.SUCCESSFUL'),
      data: user
    })

  }
}
