import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import ApiToken from 'App/Models/Users/ApiToken'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class AuthController extends MessagesI18n {
  public async register({ response, request }: HttpContextContract) {
    this.setLocaleRequest(request)

    try {
      const vali = await request.validate(RegisterValidator)

      if (!vali) {
        return
      }

      const role = await Role.find(vali.role_id)

      if (!role) {
        return response.notFound({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('notFound'),
            dataNotFound: 'Role'
          }
        })
      }

      const existUser = await User.findBy('email', vali.email)

      if (existUser) {
        return response.badRequest({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('user.exists'),
            existUser: !!existUser
          }
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
        statusResponse: 'Success',
        data: {
          message: this.getMessage('created')
        }
      })
    } catch (error) {
      Service.logsOfDeveloper(error)

      return response.badRequest({
        statusResponse: 'Error',
        data: {
          message: this.validationErr(error),
          errors: error?.messages?.errors[0]
        }
      })
    }
  }

  public async login({ response, request, auth }: HttpContextContract) {
    this.setLocaleRequest(request)

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
            statusResponse: 'Error',
            data: {
              message: this.getMessage('notFound'),
              dataNotFound: 'User'
            }
          })
        }

        const token = await auth.use('api').attempt(vali.email, vali.password, { expiresIn: '1year' })

        if (vali.remember_me_token) {
          await user.merge({ rememberMeToken: token.token }).save()
        }

        return response.ok({
          statusResponse: 'Success',
          data: {
            message: this.getMessage('login'),
            auth: {
              type: token.type,
              token: token.token,
              expires_at: token.expiresAt?.toFormat('dd-MM-yyyy  HH:mm:ss')
            }
          }
        })
      } catch (error) {
        Service.logsOfDeveloper(error)

        return response.badRequest({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('login.error'),
            errors: error?.responseText,
          }
        })
      }
    } catch (error) {
      Service.logsOfDeveloper(error)

      return response.badRequest({
        statusResponse: 'Error',
        data: {
          message: this.validationErr(error),
          errors: error?.messages?.errors[0]
        }
      })
    }
  }

  public async logout({ response, request, auth }: HttpContextContract) {
    this.setLocaleRequest(request)

    const user = await User.find(auth.use('api').user?.id)

    if (!user) {
      return response.notFound({
        statusResponse: 'Error',
        data: {
          message: this.getMessage('notFound'),
          dataNotFound: 'User'
        }
      })
    }

    await user.merge({ rememberMeToken: null }).save()

    await ApiToken.query().where('user_id', user.id).delete()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: this.getMessage('logout'),
        tokensRevoked: true,
      }
    })
  }

  public async me({ response, request, auth }: HttpContextContract) {
    this.setLocaleRequest(request)

    const user = await User.query()
      .where({ id: auth.user?.id, email: auth.user?.email })
      .preload('profile')
      .preload('role')
      .first()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: this.getMessage('auth.user'),
        user
      }
    })
  }
}
