import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Tasks/Task'
import TaskValidator from 'App/Validators/Tasks/TaskValidator'
import Service from '@ioc:Adonis/Providers/Services'

export default class TasksController {
  public async get({ i18n, response, params, auth }: HttpContextContract) {
    const { id } = auth.use('api').user!

    const tasks = await Task.query()
      .whereHas('user', users => {
        users.where('users.id', id)
      })
      .where({ active: true })
      .orderBy('id', 'desc')

    if (params.id) {
      const task = tasks.find(task => task.id == params.id)

      if (!task) {
        return response.notFound({
          statusResponse: 'Client error',
          data: {
            message: i18n.formatMessage('notFound'),
            dataNotFound: 'Task'
          }
        })
      }

      return response.ok({
        statusResponse: 'Success',
        data: {
          message: i18n.formatMessage('data'),
          task
        }
      })
    }

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('data'),
        total: tasks.length,
        tasks
      }
    })
  }

  public async create({ request, response, auth, i18n }: HttpContextContract) {
    const { id } = auth.use('api').user!

    try {
      await request.validate(TaskValidator)
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

    const { title, description } = request.body()

    await Task.create({
      user_id: id,
      title,
      description,
      active: true,
      completed: false
    })

    return response.created({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('created')
      }
    })
  }

  public async update({ request, response, params, i18n }: HttpContextContract) {
    try {
      await request.validate(TaskValidator)
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

    const update_task = request.only([
      'title',
      'description',
    ])

    const task = await Task.find(params.id)

    if (!task) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Task'
        }
      })
    }

    await task.merge(update_task).save()

    return response.ok({
      statusResponse: 'success',
      data: {
        message: i18n.formatMessage('updated')
      }
    })
  }

  public async taskStatus({ request, response, params, i18n }: HttpContextContract) {
    const { STATUS, COMPLETED_STATUS, ACTIVE_STATUS } = Task

    const { status } = request.qs()

    if (!status) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('query', {
            data: 'status'
          }),
          dataNotFound: 'status'
        }
      })
    }

    const task = await Task.find(params.id)

    if (!task) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('notFound'),
          dataNotFound: 'Task'
        }
      })
    }

    if (!Object.keys(STATUS).includes(status)) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('invalidStatus')
        }
      })
    }

    let key = ''

    if (COMPLETED_STATUS.includes(status)) {
      task.completed = STATUS[status]

      key = `task.${task.completed ? 'complete' : 'noComplete'}`
    }

    if (ACTIVE_STATUS.includes(status)) {
      task.active = STATUS[status]

      key = `status.${task.active ? 'activated' : 'desactivated'}`
    }

    await task.save()

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage(key)
      },
    })
  }
}
