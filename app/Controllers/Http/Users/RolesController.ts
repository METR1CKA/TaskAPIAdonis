import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Role from 'App/Models/Users/Role'
import RoleValidator from 'App/Validators/Roles/RoleValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class RolesController extends MessagesI18n {

  public async read({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    const roles = await Role.query()
      .preload('users')
      .orderBy('id', 'asc')

    if (params.id) {

      const role = roles.find(e => e.id == params.id)

      return role
        ? response.ok({
          message: this.getMessage('data'),
          data: role
        })
        : response.notFound({
          message: this.getMessage('notFound'),
          data: null
        })

    }

    return response.ok({
      message: this.getMessage('data'),
      data: {
        total: roles.length,
        roles
      }
    })

  }

  public async create({ request, response }: HttpContextContract) {

    this.locale = request.header(this.header)

    try {

      const vali = await request.validate(RoleValidator)

      if (!vali) {
        return
      }

      const role = await Role.create(vali)

      return response.created({
        message: this.getMessage('created'),
        data: role
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: this.validationErr(error),
        data: {
          errors: error?.messages?.errors
        }
      })

    }

  }

  public async update({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        message: this.getMessage('notFound'),
        data: null
      })
    }

    try {

      const vali = await request.validate(RoleValidator)

      if (!vali) {
        return
      }

      await role.merge(vali).save()

      return response.ok({
        message: this.getMessage('updated'),
        data: role
      })

    } catch (error) {

      Service.logsOfDeveloper(error)

      return response.badRequest({
        message: this.validationErr(error),
        data: {
          errors: error?.messages?.errors
        }
      })

    }

  }

  public async delete({ request, response, params }: HttpContextContract) {

    this.locale = request.header(this.header)

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        message: this.getMessage('notFound'),
        data: null
      })
    }

    await role.merge({ active: !role.active }).save()

    return response.ok({
      message: this.getMessage(`status.${role.active ? 'activated' : 'desactivated'}`),
      data: role
    })

  }

}
