import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Role from 'App/Models/Users/Role'
import RoleView from 'App/Models/Users/RoleView'
import RolesViewValidator from 'App/Validators/RoleView/RolesViewValidator'

export default class RoleViewsController {
  public async get({ i18n, response, params }: HttpContextContract) {
    const roles_views = await RoleView.getRolesViews()

    if (params.id) {
      const role_view = roles_views.find(role => role.id == params.id)

      if (!role_view) {
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
          role_view
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data'),
        total: roles_views.length,
        roles_views
      }
    })
  }

  public async update({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(RolesViewValidator)
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

    const { views } = request.body()

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

    // await role.related('views').sync(views)
    await RoleView.sync(role, views)

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data')
      }
    })
  }
}
