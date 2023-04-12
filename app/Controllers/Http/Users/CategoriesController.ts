import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Category from 'App/Models/Users/Category'
import MessagesI18n from 'App/Services/MessagesI18n'
import CategoryValidator from 'App/Validators/Category/CategoryValidator'

export default class CategoriesController extends MessagesI18n {
  public async get({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const categories = (
      await Category.all()
    ).map(cat => {
      cat.name = this.getMessage(cat.key)
      cat.description = this.getMessage(cat.keyd)
      return cat
    })

    if (params.id) {
      const category = categories.find(cat => cat.id == params.id)

      if (!category) {
        return Service.httpResponse(404, this.getMessage('notFound'), {
          dataNotFound: 'Category'
        })
      }

      return Service.httpResponse(200, this.getMessage('data'), {
        category
      })
    }

    return Service.httpResponse(200, this.getMessage('data'), {
      total: categories.length,
      categories
    })
  }

  public async create({ request, response }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var categoryCreate = await request.validate(CategoryValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const category = await Category.create(categoryCreate)

    await this.dbTranslations(category, 'create')

    return Service.httpResponse(201, this.getMessage('created'))
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var categoryUpdate = await request.validate(CategoryValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const category = await Category.find(params.id)

    if (!category) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Category'
      })
    }

    await category.merge(categoryUpdate).save()

    await this.dbTranslations(category, 'update')

    return Service.httpResponse(200, this.getMessage('updated'))
  }

  public async delete({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const category = await Category.find(params.id)

    if (!category) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Category'
      })
    }

    await category.merge({ active: !category.active }).save()

    return Service.httpResponse(200, this.getMessage(`status.${category.active ? 'activated' : 'desactivated'}`))
  }
}
