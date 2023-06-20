import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Translation from 'App/Models/Translation'
import View from 'App/Models/Users/View'
import ViewValidator from 'App/Validators/View/ViewValidator'

export default class ViewsController {
  public async get({ i18n, response, params }: HttpContextContract) {
    const views = (await View.all()).map(view => {
      view.name = i18n.formatMessage(view.key)
      view.description = i18n.formatMessage(view.keyd)
      return view
    })

    if (params.id) {
      const view = views.find(view => view.id == params.id)

      if (!view) {
        return response.notFound({
          statusResponse: 'Client error',
          data: {
            message: i18n.formatMessage('notFound'),
            dataNotFound: 'View'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('data'),
          view
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data'),
        total: views.length,
        views
      }
    })
  }

  public async create({ request, response, i18n }: HttpContextContract) {
    try {
      await request.validate(ViewValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: { message: error.message }
      })
    }

    const viewData = request.body()

    const view = await View.create(viewData)

    await Translation.createKeys(view)

    return response.created({
      statusResponse: 'Success',
      data: { message: i18n.formatMessage('created') }
    })
  }

  public async update({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(ViewValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: { message: error.message }
      })
    }

    const viewUpdate = request.body()

    const view = await View.find(params.id)

    if (!view) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'View'
        }
      })
    }

    await view.merge(viewUpdate).save()

    await Translation.updateKeys(view, i18n.locale)

    return response.ok({
      statusResponse: 'Success',
      data: { message: i18n.formatMessage('updated') }
    })
  }

  public async delete({ i18n, response, params }: HttpContextContract) {
    const view = await View.find(params.id)

    if (!view) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'View'
        }
      })
    }

    await view.merge({ active: !view.active }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage(`status.${view.active ? 'activated' : 'desactivated'}`)
      }
    })
  }
}
