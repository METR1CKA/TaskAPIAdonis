import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'
import UpdateValidator from 'App/Validators/Users/UpdateValidator'
import Service from '@ioc:Adonis/Providers/Services'
import RegisterAuthValidator from 'App/Validators/Users/RegisterAuthValidator'

export default class UsersController {
  /**
   * @swagger
   * components:
   *  responses:
   *    UsersGetSuccess:
   *      description: Get user succcessful
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/GetAllUserSchema'
   *    UserGetOneSuccess:
   *      description: Get user by id
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/GetOneUserSchema'
   */
  public async read({ i18n, response, params }: HttpContextContract) {
    const users = await User.query()
      .preload('profile', profile => {
        profile.preload('lang')
      })
      .preload('role')
      .orderBy('id', 'desc')

    if (params.id) {
      const user = users.find(user => user.id == params.id)

      if (!user) {
        return response.notFound({
          statusResponse: 'Client error',
          data: {
            message: i18n.formatMessage('notFound'),
            dataNotFound: 'User'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('data'),
          user
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data'),
        total: users.length,
        users
      }
    })
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    UserCreateRequest:
   *      description: Data for create user
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/RegisterValidator"
   */
  public async create({ request, response, i18n }: HttpContextContract) {
    try {
      await request.validate(RegisterAuthValidator)
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

    const {
      email,
      password,
      role_id,
      name,
      lastname,
      phone,
      address,
      lang_id
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

    const existUser = await User.findBy('email', email)

    if (existUser) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('user.exist'),
          existUser: Boolean(existUser)
        }
      })
    }

    const user = await User.create(
      {
        email,
        password,
        active: true,
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
        message: i18n.formatMessage('created')
      }
    })
  }

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    UsersUpdateRequest:
   *      description:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/UpdateValidator'
   */
  public async update({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(UpdateValidator)
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

    const {
      email,
      active,
      role_id,
      name,
      lastname,
      phone,
      address,
      lang_id
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

    const profile = await Profile.findBy('user_id', user.id)

    if (!profile) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Profile'
        }
      })
    }

    await user.merge(
      {
        email,
        active,
        role_id: role.id
      }
    ).save()

    await profile.merge(
      {
        user_id: user.id,
        name,
        lastname,
        phone,
        address,
        lang_id
      }
    ).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('updated')
      }
    })
  }

  public async delete({ i18n, response, params }: HttpContextContract) {
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

    await user.merge({ active: !user.active }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage(`status.${user.active ? 'activated' : 'desactivated'}`)
      }
    })
  }
}
