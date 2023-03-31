import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Users/Role'
import RoleValidator from 'App/Validators/Roles/RoleValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class RolesController extends MessagesI18n {
  public async read({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)

    const roles = await Role.query()
      .preload('users')
      .orderBy('id', 'asc')

    if (params.id) {
      const role = roles.find(e => e.id == params.id)

      if (!role) {
        return response.notFound({
          statusResponse: 'Error',
          data: {
            message: this.getMessage('notFound'),
            dataNotFound: 'Role'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: this.getMessage('data'),
          role
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: this.getMessage('data'),
        total: roles.length,
        roles
      }
    })
  }

  public async create({ request, response }: HttpContextContract) {
    this.setLocaleRequest(request)

    try {
      const vali = await request.validate(RoleValidator)

      if (!vali) {
        return
      }

      await Role.create(vali)

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

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        statusResponse: 'Error',
        data: {
          message: this.getMessage('notFound'),
          dataNotFound: 'Role'
        }
      })
    }

    try {
      const vali = await request.validate(RoleValidator)

      if (!vali) {
        return
      }

      await role.merge(vali).save()

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

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        statusResponse: 'Error',
        data: {
          message: this.getMessage('notFound'),
          dataNotFound: 'Role'
        }
      })
    }

    await role.merge({ active: !role.active }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: this.getMessage(`status.${role.active ? 'activated' : 'desactivated'}`),
      }
    })
  }
}
