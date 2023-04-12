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
    Service.setResponseObject(response)

    const users = await User.query()
      .preload('profile')
      .preload('role')
      .orderBy('id', 'desc')

    if (params.id) {
      const user = users.find(user => user.id == params.id)

      if (!user) {
        return Service.httpResponse(404, this.getMessage('notFound'), {
          dataNotFound: 'User'
        })
      }

      return Service.httpResponse(200, this.getMessage('data'), {
        user
      })
    }

    return Service.httpResponse(200, this.getMessage('data'), {
      total: users.length,
      users
    })
  }

  public async create({ request, response }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var dataUser = await request.validate(RegisterValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { email, password, active, role_id, name, lastname, phone, address } = dataUser

    const role = await Role.find(role_id)

    if (!role) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Role'
      })
    }

    const existUser = await User.findBy('email', email)

    if (existUser) {
      return Service.httpResponse(400, this.getMessage('user.exist'), {
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

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var dataUpdate = await request.validate(UpdateValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { email, active, role_id, name, lastname, phone, address } = dataUpdate

    const role = await Role.find(role_id)

    if (!role) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Role'
      })
    }

    const user = await User.find(params.id)

    if (!user) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'User'
      })
    }

    const profile = await Profile.findBy('user_id', user.id)

    if (!profile) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Profile'
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
        address
      }
    ).save()

    return Service.httpResponse(200, this.getMessage('updated'))
  }

  public async delete({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const user = await User.find(params.id)

    if (!user) {
      return Service.httpResponse(404, this.getMessage('notFound'))
    }

    await user.merge({ active: !user.active }).save()

    return Service.httpResponse(200, this.getMessage(`status.${user.active ? 'activated' : 'desactivated'}`))
  }
}
