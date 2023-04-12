import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Role from 'App/Models/Users/Role'
import RoleView from 'App/Models/Users/RoleView'
import MessagesI18n from 'App/Services/MessagesI18n'
import RolesViewValidator from 'App/Validators/RoleView/RolesViewValidator'

export default class RoleViewsController extends MessagesI18n {
  public async get({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const roles = await Role.query()
      .preload('views', viewQuery => {
        viewQuery.preload('role_views')
        // .where('roles_views.active', true)
      })
      .orderBy('id', 'desc')

    if (params.id) {
      const role = roles.find(role => role.id == params.id)

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

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var rvData = await request.validate(RolesViewValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { views, active } = rvData

    const role = await Role.find(params.id)

    if (!role) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Role'
      })
    }

    const role_views = await RoleView.query().where({ role_id: role.id })

    const role_views_ids = role_views.map(rv => rv.view_id)

    let deletable: any[] = []
    let addable: any[] = []
    let editable: any[] = []

    deletable = role_views.filter(
      rv => rv.active && views.indexOf(rv.view_id) == -1
    )

    deletable = deletable.map(drv => drv.id)

    addable = views.filter(
      new_views => role_views_ids.indexOf(new_views) == -1
    )

    addable = addable.map(view_id => {
      return {
        role_id: role.id,
        view_id,
        active,
      }
    })

    editable = role_views.filter(
      rol_view => !rol_view.active && views.indexOf(rol_view.view_id) != -1
    )

    editable = editable.map(rv => rv.id)

    await RoleView.query().whereIn('id', deletable).update({ active: false })
    await RoleView.query().whereIn('id', editable).update({ active: true })
    await RoleView.createMany(addable)

    return Service.httpResponse(200, this.getMessage('data'))
  }
}
