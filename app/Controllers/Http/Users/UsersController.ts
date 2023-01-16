import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import UpdateValidator from 'App/Validators/Users/UpdateValidator'
import ExceptionHandler from 'App/Exceptions/Handler'

export default class UsersController {

  public header = 'Accept-Language'
  public exception = new ExceptionHandler()

  public async read({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const users = await User.query()
      .preload('profile')
      .preload('role')
      .orderBy('id', 'desc')

    if (params.id) {

      const data = users.find(e => e.id == params.id)

      const status = data ? 200 : 404

      const message = lang.getMessage(status === 200 ? 'data' : 'notFound')

      return response.status(status).json({ message, data })

    }

    return response.ok({
      message: lang.getMessage('data'),
      data: {
        total: users.length,
        users
      }
    })

  }

  public async create({ request, response }: HttpContextContract) {

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
          messages: lang.getMessage('user.exist'),
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

  public async update({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    try {

      const vali = await request.validate(UpdateValidator)

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

      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: lang.getMessage('notFound'),
          data: null
        })
      }

      const profile = await Profile.findBy('user_id', user.id)

      if (!profile) {
        return response.notFound({
          message: lang.getMessage('notFound'),
          data: null
        })
      }

      await user.merge(
        {
          'email': vali.email,
          'active': vali.active,
          'role_id': role.id
        }
      ).save()

      await profile.merge(
        {
          'user_id': user.id,
          'name': vali.name,
          'lastname': vali.lastname,
          'phone': vali.phone,
          'address': vali.address
        }
      ).save()

      return response.ok({
        message: lang.getMessage('updated'),
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

  public async delete({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: lang.getMessage('notFound'),
        data: null
      })
    }

    await user.merge({ active: !user.active }).save()

    return response.ok({
      message: lang.getMessage(user.active ? 'status.activated' : 'status.desactivated'),
      data: null
    })

  }
}
