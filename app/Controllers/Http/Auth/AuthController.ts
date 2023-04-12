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
    Service.setResponseObject(response)

    try {
      var dataRegister = await request.validate(RegisterValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { email, password, active, role_id, name, lastname, phone, address } = dataRegister

    const role = await Role.find(role_id)

    if (!role) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Role'
      })
    }

    const existUser = await User.findBy('email', email)

    if (existUser) {
      return Service.httpResponse(400, this.getMessage('user.exists'), {
        existUser: !!existUser
      })
    }

    const user = await User.create(
      {
        email,
        password,
        active,
        role_id
      }
    )

    await Profile.create(
      {
        user_id: user.id,
        name,
        lastname,
        phone,
        address
      }
    )

    return Service.httpResponse(201, this.getMessage('created'))
  }

  public async login({ response, request, auth }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var credentials = await request.validate(LoginValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { email, password, remember_me_token } = credentials

    try {
      await auth.use('api').verifyCredentials(email, password)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.getMessage('login.error'), {
        errors: error?.responseText,
      })
    }

    const user = await User.findBy('email', email)

    if (!user) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'User'
      })
    }

    if (user.rememberMeToken) {
      const currentToken = await ApiToken.query()
        .where({ user_id: user.id, token: user.rememberMeToken })
        .first()

      return Service.httpResponse(200, this.getMessage('remember_me_token'), {
        auth: {
          type: 'bearer',
          token: currentToken!.tokenNoHash,
          expires_at: currentToken!.expires_at!.toFormat('dd-MM-yyyy  HH:mm:ss')
        }
      })
    }

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '1year',
    })

    await ApiToken.query()
      .where({ user_id: user.id, token: token.tokenHash })
      .update({ token_no_hash: token.token })

    if (remember_me_token) {
      await user.merge({ rememberMeToken: token.tokenHash }).save()
    }

    return Service.httpResponse(200, this.getMessage('login'), {
      auth: {
        type: token.type,
        token: token.token,
        expires_at: token.expiresAt!.toFormat('dd-MM-yyyy  HH:mm:ss')
      }
    })
  }

  public async logout({ response, request, auth }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const user = await User.find(auth.use('api').user!.id)

    await user!.merge({ rememberMeToken: null }).save()

    await ApiToken.query().where({ user_id: user!.id }).delete()

    const revoked = await ApiToken.query().where({ user_id: user!.id })

    return Service.httpResponse(200, this.getMessage('logout'), {
      tokensRevoked: revoked.length == 0,
    })
  }

  public async me({ request, response, auth }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const user = await User.query()
      .where({ id: auth.user!.id, email: auth.user!.email })
      .preload('profile')
      .preload('role')
      .first()

    return Service.httpResponse(200, this.getMessage('auth.user'), { user })
  }
}
