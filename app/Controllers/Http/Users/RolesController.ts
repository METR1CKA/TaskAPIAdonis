import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Users/Role'
import RoleValidator from 'App/Validators/Roles/RoleValidator'
import Service from '@ioc:Adonis/Providers/Services'

export default class RolesController {
  public async read({ i18n, response, params }: HttpContextContract) {
    const roles = await Role.query()
      .preload('users')
      .orderBy('id', 'asc')

    if (params.id) {
      const role = roles.find(role => role.id == params.id)

      if (!role) {
        return response.notFound({
          statusResponse: 'Client error',
          data: {
            message: i18n.formatMessage('notFound'),
            dataNotFound: 'Role'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('data'),
          role
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data'),
        total: roles.length,
        roles
      }
    })
  }

  public async create({ request, response, i18n }: HttpContextContract) {
    try {
      await request.validate(RoleValidator)
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

    const dataRole = request.only([
      'name',
      'active',
      'description'
    ])

    await Role.create(dataRole)

    return response.created({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('created')
      }
    })
  }

  public async update({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(RoleValidator)
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

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Role'
        }
      })
    }

    const dataUpdate = request.only([
      'name',
      'active',
      'description'
    ])

    await role.merge(dataUpdate).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('updated')
      }
    })
  }

  public async delete({ i18n, response, params }: HttpContextContract) {
    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        statusResponse: 'Client error',
        dataNotFound: 'Role'
      })
    }

    await role.merge({ active: !role.active }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage(`status.${role.active ? 'activated' : 'desactivated'}`)
      }
    })
  }
}
