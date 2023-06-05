import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import ApiToken from 'App/Models/Users/ApiToken'
import Service from '@ioc:Adonis/Providers/Services'
import Lang from 'App/Models/Users/Lang'

export default class AuthController {
  public async register({ response, request, i18n }: HttpContextContract) {
    try {
      await request.validate(RegisterValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation.messages)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: { message: error.message }
      })
    }

    const {
      email, password, active, role_id, name, lastname, phone, address, lang_id
    } = request.body()

    const role = await Role.find(role_id)

    if (!role) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Role'
        }
      })
    }

    const lang = await Lang.find(lang_id)

    if (!lang) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Lang'
        }
      })
    }

    const existUser = await User.findBy('email', email)

    if (existUser) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('user.exists'),
          existUser: Boolean(existUser)
        }
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
        address,
        lang_id
      }
    )

    return response.created({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('created'),
      }
    })
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    LoginRequest:
   *      description: Data for sign in the app
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/LoginValidator'
   *  responses:
   *    LoginBadRequest:
   *      description: Bad response
   *      content:
   *        application/json:
   *          description: Validation for request or user exists
   *          schema:
   *            anyOf:
   *              - $ref: '#/components/schemas/ValidationError'
   *              - $ref: '#/components/schemas/ResponseText'
   *    LoginSuccess:
   *      description: Success sign in
   *      content:
   *        application/json:
   *          description: Generation of token to access
   *          schema:
   *            $ref: '#/components/schemas/LoginSchema'
   */
  public async login({ response, request, auth, i18n }: HttpContextContract) {
    try {
      await request.validate(LoginValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation.messages)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: { message: error.message }
      })
    }

    const { email, password, remember_me_token } = request.body()

    try {
      await auth.use('api').verifyCredentials(email, password)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return response.badRequest({
        statusResponse: 'Client error',
        data: { message: i18n.formatMessage('login.error') }
      })
    }

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

    if (user.rememberMeToken) {
      const currentToken = await ApiToken.query()
        .where({ user_id: user.id, token: user.rememberMeToken })
        .first()

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('remember_me_token'),
          auth: {
            type: 'bearer',
            token: currentToken!.tokenNoHash,
            expires_at: currentToken!.expires_at!.toFormat(Service.formatDate)
          }
        }
      })
    }

    const newToken = await auth.use('api').attempt(email, password, {
      expiresIn: '1year',
    })

    await ApiToken.query()
      .where({ user_id: user.id, token: newToken.tokenHash })
      .update({ token_no_hash: newToken.token })

    if (remember_me_token) {
      await user.merge({ rememberMeToken: newToken.tokenHash }).save()
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('login'),
        auth: {
          type: newToken.type,
          token: newToken.token,
          expires_at: newToken.expiresAt!.toFormat(Service.formatDate)
        }
      }
    })
  }

  /**
   * @swagger
   * components:
   *  responses:
   *    LogoutSuccess:
   *      description: Success sign out
   *      content:
   *        application/json:
   *          description: Token revocater
   *          schema:
   *            $ref: '#/components/schemas/LogoutSchema'
   */
  public async logout({ response, i18n, auth }: HttpContextContract) {
    const user = await User.find(auth.use('api').user!.id)

    await user!.merge({ rememberMeToken: null }).save()

    await ApiToken.query().where({ user_id: user!.id }).delete()

    const revoked = await ApiToken.query().where({ user_id: user!.id })

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('logout'),
        tokensRevoked: revoked.length == 0,
      }
    })
  }

  /**
   * @swagger
   * components:
   *  responses:
   *    MeSuccess:
   *      description: Success to get auth User data
   *      content:
   *        application/json:
   *          description: Token revocater
   *          schema:
   *            $ref: '#/components/schemas/MeSchema'
   */
  public async me({ i18n, response, auth }: HttpContextContract) {
    const user = await User.query()
      .where({ id: auth.user!.id, email: auth.user!.email })
      .preload('profile')
      .preload('role')
      .first()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('auth.user'),
        user
      }
    })
  }
}
