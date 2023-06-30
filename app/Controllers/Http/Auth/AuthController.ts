import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/Auth/LoginValidator'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import Profile from 'App/Models/Users/Profile'
import ApiToken from 'App/Models/Users/ApiToken'
import Service from '@ioc:Adonis/Providers/Services'
import Lang from 'App/Models/Users/Lang'

export default class AuthController {
  /**
   * @swagger
   * components:
   *  requestBodies:
   *    UserRegisterRequest:
   *      description: Data for register users
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/RegisterAuthValidator"
   */
  public async register({ response, request, i18n }: HttpContextContract) {
    try {
      await request.validate(RegisterValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation.messages)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: error.message
        }
      })
    }

    const {
      email,
      password,
      name,
      lastname,
      phone,
      address,
      lang_id
    } = request.body()

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

    const DEFAULT_ROLE = 3

    const user = await User.create(
      {
        email,
        password,
        active: true,
        role_id: DEFAULT_ROLE // Default role EDITOR
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
        data: {
          message: error.message
        }
      })
    }

    const {
      email,
      password,
      remember_me_token
    } = request.body()

    try {
      await auth.use('api').verifyCredentials(email, password)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('login.error')
        }
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

    const { id, rememberMeToken } = user

    if (rememberMeToken) {
      const currentToken = await ApiToken.query()
        .where({ user_id: id, token: rememberMeToken })
        .first()

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('remember_me_token'),
          auth: {
            type: 'bearer',
            token: currentToken?.tokenNoHash,
            expires_at: currentToken?.expires_at?.toFormat(Service.getFormatDate())
          }
        }
      })
    }

    const { type, token, tokenHash, expiresAt } = await auth.use('api').attempt(
      email,
      password,
      {
        expiresIn: '1year'
      }
    )

    await ApiToken.query()
      .where({ user_id: id, token: tokenHash })
      .update({ token_no_hash: token })

    if (remember_me_token) {
      await user.merge({ rememberMeToken: tokenHash }).save()
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('login'),
        auth: {
          type,
          token,
          expires_at: expiresAt?.toFormat(Service.getFormatDate())
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
    const { id } = auth.use('api').user!

    await User.query()
      .where({ id })
      .update({ rememberMeToken: null })

    await ApiToken.query()
      .where({ user_id: id })
      .delete()

    const revoked = await ApiToken.query()
      .where({ user_id: id })

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
    const { id } = auth.use('api').user!

    const user = await User.query()
      .where({ id })
      .preload('profile', profile => {
        profile
          .preload('lang')
      })
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
