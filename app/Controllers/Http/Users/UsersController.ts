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
    this.setLocaleRequest(request)

    const users = await User.query()
      .preload('profile')
      .preload('role')
      .orderBy('id', 'desc')

    if (params.id) {
      const user = users.find(user => user.id == params.id)

      if (!user) {
        return response.notFound({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('notFound'),
            dataNotFound: 'User'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: this.getMessage('data'),
          user
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: this.getMessage('data'),
        total: users.length,
        users
      }
    })
  }

  public async create({ request, response }: HttpContextContract) {
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
            messages: this.getMessage('user.exist'),
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
          message: this.getMessage('created'),
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

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)

    try {
      const vali = await request.validate(UpdateValidator)

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

      const user = await User.find(params.id)

      if (!user) {
        return response.notFound({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('notFound'),
            dataNotFound: 'User'
          }
        })
      }

      const profile = await Profile.findBy('user_id', user.id)

      if (!profile) {
        return response.notFound({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('notFound'),
            dataNotFound: 'Profile'
          }
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
        statusResponse: 'Success',
        data: {
          message: this.getMessage('updated'),
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

  public async delete({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound({
        statusResponse: 'Error',
        data: {
          message: this.getMessage('notFound'),
          dataNotFound: 'User'
        }
      })
    }

    await user.merge({ active: !user.active }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: this.getMessage(`status.${user.active ? 'activated' : 'desactivated'}`),
      }
    })
  }
}
