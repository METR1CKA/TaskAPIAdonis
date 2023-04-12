import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Users/Role'
import RoleValidator from 'App/Validators/Roles/RoleValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class RolesController extends MessagesI18n {
  public async read({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const roles = await Role.query()
      .preload('users')
      .orderBy('id', 'asc')

    if (params.id) {
      const role = roles.find(e => e.id == params.id)

      if (!role) {
        return Service.httpResponse(404, this.getMessage('notFound'), {
          dataNotFound: 'Role'
        })
      }

      return Service.httpResponse(200, this.getMessage('data'), {
        role
      })
    }

    return Service.httpResponse(200, this.getMessage('data'), {
      total: roles.length,
      roles
    })
  }

  public async create({ request, response }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var dataRole = await request.validate(RoleValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    await Role.create(dataRole)

    return Service.httpResponse(201, this.getMessage('created'))
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const role = await Role.find(params.id)

    if (!role) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Role'
      })
    }

    try {
      var dataUpdate = await request.validate(RoleValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    await role.merge(dataUpdate).save()

    return Service.httpResponse(200, this.getMessage('updated'))
  }

  public async delete({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const role = await Role.find(params.id)

    if (!role) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Role'
      })
    }

    await role.merge({ active: !role.active }).save()

    return Service.httpResponse(200, this.getMessage(`status.${role.active ? 'activated' : 'desactivated'}`))
  }
}
