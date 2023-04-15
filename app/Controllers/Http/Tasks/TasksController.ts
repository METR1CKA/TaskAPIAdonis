import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Task from 'App/Models/Tasks/Task'
import TaskValidator from 'App/Validators/Tasks/TaskValidator'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'

export default class TasksController extends MessagesI18n {
  public async get({ request, response, params, auth }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const authUser = auth.use('api').user!

    const tasks = await Task.query()
      .whereHas('user', users => {
        users.where('users.id', authUser.id)
      })
      .where({ active: true })
      .orderBy('id', 'desc')

    if (params.id) {
      const task = tasks.find(element => element.id == params.id)

      if (!task) {
        return Service.httpResponse(404, this.getMessage('notFound'), {
          dataNotFound: 'Task'
        })
      }

      return Service.httpResponse(200, this.getMessage('data'), {
        task
      })
    }

    return Service.httpResponse(200, this.getMessage('data'), {
      total: tasks.length,
      tasks
    })
  }

  public async create({ request, response, auth }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const authUser = auth.use('api').user!

    try {
      var create_task = await request.validate(TaskValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const { title, description } = create_task

    await Task.create({
      user_id: authUser.id,
      title,
      description,
      active: true,
      completed: false
    })

    return Service.httpResponse(201, this.getMessage('created'))
  }

  public async update({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    try {
      var update_task = await request.validate(TaskValidator)
    } catch (error) {
      Service.logsOfDeveloper(error)

      return Service.httpResponse(400, this.validationErr(error), {
        errors: error?.messages?.errors[0]
      })
    }

    const task = await Task.find(params.id)

    if (!task) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Task'
      })
    }

    await task.merge(update_task).save()

    return Service.httpResponse(200, this.getMessage('updated'))
  }

  public async taskStatus({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const task = await Task.find(params.id)

    if (!task) {
      return Service.httpResponse(404, this.getMessage('notFound'), {
        dataNotFound: 'Task'
      })
    }

    if (request.method() == 'PATCH') {
      await task.merge({ completed: !task.completed }).save()

      return Service.httpResponse(200, this.getMessage(
        `task.${task.completed ? 'complete' : 'noComplete'}`
      ))
    }

    await task.merge({ active: !task.active }).save()

    return Service.httpResponse(200, this.getMessage(
      `status.${task.active ? 'activated' : 'desactivated'}`
    ))
  }
}
