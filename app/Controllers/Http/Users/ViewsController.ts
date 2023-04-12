import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import View from 'App/Models/Users/View'
import MessagesI18n from 'App/Services/MessagesI18n'
import ViewValidator from 'App/Validators/View/ViewValidator'

export default class ViewsController extends MessagesI18n {
  public async get({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const views = (
      await View.all()
    ).map(view => {
      view.name = this.getMessage(view.key)
      view.description = this.getMessage(view.keyd)
      return view
    })

    if (params.id) {
      const view = views.find(cat => cat.id == params.id)

      if (!view) {
        return Service.httpResponse(404, this.getMessage('notFound'), {
          dataNotFound: 'View'
        })
      }

      return Service.httpResponse(200, this.getMessage('data'), {
        view
      })
    }

    return Service.httpResponse(200, this.getMessage('data'), {
      total: views.length,
      views
    })
  }

  public async create({ request, response }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var viewCreate = await request.validate(ViewValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const view = await View.create(viewCreate)

    await this.dbTranslations(view, 'create')

    return Service.httpResponse(201, this.getMessage('created'))
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var viewUpdate = await request.validate(ViewValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const view = await View.find(params.id)

    if (!view) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'View'
      })
    }

    await view.merge(viewUpdate).save()

    await this.dbTranslations(view, 'update')

    return Service.httpResponse(200, this.getMessage('updated'))
  }

  public async delete({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const view = await View.find(params.id)

    if (!view) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'View'
      })
    }

    await view.merge({ active: !view.active }).save()

    return Service.httpResponse(200, this.getMessage(`status.${view.active ? 'activated' : 'desactivated'}`))
  }
}
