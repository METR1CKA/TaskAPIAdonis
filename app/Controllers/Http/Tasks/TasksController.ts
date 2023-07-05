import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Tasks/Task'
import TaskValidator from 'App/Validators/Tasks/TaskValidator'
import Service from '@ioc:Adonis/Providers/Services'

export default class TasksController {
  /**
   * @swagger
   * components:
   *  responses:
   *    TasksGetSuccess:
   *      description: Get all tasks succcessful
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/GetAllTasksSchema'
   *    TaskGetOneSuccess:
   *      description: Get one task by id
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/GetOneTaskSchema'
   */
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

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    TaskCreateRequest:
   *      description: Data for create tasks
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: "#/components/schemas/TaskValidator"
   */
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

  /**
   * @swagger
   * components:
   *  requestBodies:
   *    TaskUpdateRequest:
   *      description:
   *      required: true
   *      content:
   *        application/json:
   *          schema:
   *            $ref: '#/components/schemas/TaskValidator'
   */
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
    const { completed, active } = request.qs()

    if (!completed || !active) {
      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('query', {
            data: !completed && !active
              ? 'completed & active'
              : !completed ? 'completed' : 'active'
          })
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

    await task.merge({
      completed: completed.toLowerCase() == 'true',
      active: active.toLowerCase() == 'true'
    }).save()

    const task_complete = i18n.formatMessage(`task.${task.completed ? 'complete' : 'noComplete'}`)

    const task_active = i18n.formatMessage(`status.${task.active ? 'activated' : 'desactivated'}`)

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: `${task_complete} & ${task_active}`
      },
    })
  }
}
