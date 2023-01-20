import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Profile from 'App/Models/Users/Profile'
import Role from 'App/Models/Users/Role'
import User from 'App/Models/Users/User'
import RegisterValidator from 'App/Validators/Users/RegisterValidator'
import UpdateValidator from 'App/Validators/Users/UpdateValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class UsersController extends MessagesI18n {

  public async read({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    const users = await User.query()
      .preload('profile')
      .preload('role')
      .orderBy('id', 'desc')

    if (params.id) {

      const data = users.find(element => element.id == params.id)

      if (!data) {
        return response.notFound({
          message: this.getMessage('notFound'),
          data
        })
      }

      return response.ok({
        message: this.getMessage('data'),
        data
      })

    }

    return response.ok({
      message: this.getMessage('data'),
      data: {
        total: users.length,
        users
      }
    })

  }

  public async create({ request, response }: HttpContextContract) {

    this.locale = request.header(this.header)

    try {

      const vali = await request.validate(RegisterValidator)

      if (!vali) {
        return
      }

      const role = await Role.find(vali.role_id)

      if (!role) {
        return response.notFound({
          message: this.getMessage('notFound'),
          data: null
        })
      }

      const existUser = await User.findBy('email', vali.email)

      if (existUser) {
        return response.badRequest({
          messages: this.getMessage('user.exist'),
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
        message: this.getMessage('created'),
        data: null
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: this.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

  public async update({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    try {

      const vali = await request.validate(UpdateValidator)

      if (!vali) {
        return
      }

      const role = await Role.find(vali.role_id)

      if (!role) {
        return response.notFound({
          message: this.getMessage('notFound'),
          data: null
        })
      }

      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          message: this.getMessage('notFound'),
          data: null
        })
      }

      const profile = await Profile.findBy('user_id', user.id)

      if (!profile) {
        return response.notFound({
          message: this.getMessage('notFound'),
          data: null
        })
      }

      await user.merge(
        {
          email: vali.email,
          active: vali.active,
          role_id: role.id
        }
      ).save()

      await profile.merge(
        {
          user_id: user.id,
          name: vali.name,
          lastname: vali.lastname,
          phone: vali.phone,
          address: vali.address
        }
      ).save()

      return response.ok({
        message: this.getMessage('updated'),
        data: null
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: this.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }

  }

  public async delete({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        message: this.getMessage('notFound'),
        data: null
      })
    }

    await user.merge({ active: !user.active }).save()

    return response.ok({
      message: this.getMessage(user.active ? 'status.activated' : 'status.desactivated'),
      data: null
    })

  }
}
