import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from '@ioc:Adonis/Providers/Services'
import Translation from 'App/Models/Translation'
import Category from 'App/Models/Users/Category'
import CategoryValidator from 'App/Validators/Category/CategoryValidator'

export default class CategoriesController {
  public async get({ i18n, response, params }: HttpContextContract) {
    const categories = (
      await Category.all()
    ).map(cat => {
      cat.name = i18n.formatMessage(cat.key)
      cat.description = i18n.formatMessage(cat.keyd)
      return cat
    })

    if (params.id) {
      const category = categories.find(category => category.id == params.id)

      if (!category) {
        return response.notFound({
          statusResponse: 'Client error',
          data: {
            message: i18n.formatMessage('not_found'),
            dataNotFound: 'Category'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('data'),
          category
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data'),
        total: categories.length,
        categories
      }
    })
  }

  public async create({ request, response, i18n }: HttpContextContract) {
    try {
      await request.validate(CategoryValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation.messages)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: error.message,
        }
      })
    }

    const categoryData = request.only([
      'name',
      'active',
      'order_index',
      'description'
    ])

    const category = await Category.create(categoryData)

    await Translation.createKeys(category)

    return response.created({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('created')
      }
    })
  }

  public async update({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(CategoryValidator)
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

    const categoryData = request.only([
      'name',
      'active',
      'order_index',
      'description'
    ])

    const category = await Category.find(params.id)

    if (!category) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Category'
        }
      })
    }

    await category.merge(categoryData).save()

    await Translation.updateKeys(category, i18n.locale)

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('updated')
      }
    })
  }

  public async delete({ i18n, response, params }: HttpContextContract) {
    const category = await Category.find(params.id)

    if (!category) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound')
        }
      })
    }

    await category.merge({ active: !category.active }).save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage(`status.${category.active ? 'activated' : 'desactivated'}`)
      }
    })
  }
}
