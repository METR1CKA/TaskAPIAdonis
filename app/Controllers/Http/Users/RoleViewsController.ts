import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Role from 'App/Models/Users/Role'
import RoleView from 'App/Models/Users/RoleView'
import RolesViewValidator from 'App/Validators/RoleView/RolesViewValidator'

export default class RoleViewsController {
  public async get({ i18n, response, params }: HttpContextContract) {
    const roles_query = await Role.query()
      .preload('views', views => {
        views.preload('role_views')
          .orderBy('views.order_index', 'asc')
          .where('role_views.active', true)
      })
      .orderBy('id', 'desc')

    const roles = roles_query.map((role: any) => {
      role.views = role.views.map((view: any) => {
        view.role_views = view.role_views.filter((role_view: any) => role_view.role_id == role.id)
        return view
      })
      return role
    })

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
