import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import Role from 'App/Models/Users/Role'
import RoleValidator from 'App/Validators/Roles/RoleValidator'

export default class RolesController {

  public async get({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header('Accept-language'))

    const roles = await Role.query()
      .preload('users')
      .orderBy('id', 'asc')

    if (params.id) {

      const role = roles.find(e => e.id == params.id)

      return role
        ? response.ok({
          message: lang.messageC('messages.success.one', 'role'),
          data: role
        })
        : response.notFound({
          message: lang.messageC('messages.errors.notFound', 'role'),
          data: null
        })

    }

    return response.ok({
      message: lang.messageC('messages.success.one', 'roles'),
      data: {
        total: roles.length,
        roles
      }
    })

  }

  public async create({ request, response }: HttpContextContract) {

    const lang = new MessagesI18n(request.header('Accept-language'))

    try {

      const vali = await request.validate(RoleValidator)

      if (!vali) {
        return
      }

      const role = await Role.create(vali)

      return response.created({
        message: lang.messageC('messages.success.create', 'role'),
        data: role
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: null
      })

    }

  }

  public async update({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header('Accept-language'))

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'role'),
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
        message: lang.messageC('messages.success.update', 'role'),
        data: role
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: null
      })

    }

  }

  public async delete({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header('Accept-language'))

    const role = await Role.find(params.id)

    if (!role) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'role'),
        data: null
      })
    }

    await role.merge({ active: !role.active }).save()

    return response.ok({
      message: lang.messageC('messages.success.status', 'role'),
      data: role
    })

  }

}
