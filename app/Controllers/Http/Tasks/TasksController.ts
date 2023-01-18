import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Services/MessagesI18n'
import Task from 'App/Models/Tasks/Task'
import TasksUpdateValidator from 'App/Validators/Tasks/TasksUpdateValidator'
import TaskValidator from 'App/Validators/Tasks/TaskValidator'
import ExceptionHandler from 'App/Exceptions/Handler'

export default class TasksController {

  public header = 'Accept-Language'
  public exception = new ExceptionHandler()

  public async read({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const tasks = await Task.query()
      .preload('user')
      .preload('files')
      .orderBy('id', 'desc')

    if (params.id) {

      const task = tasks.find(element => element.id == params.id)

      if (!task) {
        return response.notFound({
          message: lang.getMessage('notFound'),
          data: null
        })
      }

      return response.ok({
        message: lang.getMessage('data'),
        data: task
      })

    }

    return response.ok({
      message: lang.getMessage('data'),
      data: {
        total: tasks.length,
        tasks
      }
    })

  }

  public async create({ request, response }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    try {

      const vali = await request.validate(TaskValidator)

      if (!vali) {
        return
      }

      await Task.create({
        user_id: vali.user_id,
        title: vali.title,
        description: vali.description,
        completed: false
      })

      return response.created({
        message: lang.getMessage('created'),
        data: null
      })

    } catch (error) {

      this.exception.devLogs(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }
  }

  public async update({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const task = await Task.find(params.id)

    if (!task) {
      return response.notFound({
        message: lang.getMessage('notFound'),
        data: null
      })
    }

    try {

      const vali = await request.validate(TasksUpdateValidator)

      if (!vali) {
        return
      }

      await task.merge(vali).save()

      return response.ok({
        message: lang.getMessage('updated'),
        data: null
      })

    } catch (error) {

      console.log(error)

      return response.badRequest({
        message: lang.validationErr(error),
        data: {
          error: error?.messages
        }
      })

    }
  }

  public async delete({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const task = await Task.find(params.id)

    if (!task) {
      return response.notFound({
        message: lang.getMessage('notFound'),
        data: null
      })
    }

    if (request.input('type') == 'delete') {
      await task.delete()

      return response.ok({
        message: lang.getMessage('deleted'),
        data: null
      })
    }

    if (request.input('type') == 'complete') {
      await task.merge({ completed: !task.completed }).save()

      return response.ok({
        message: lang.getMessage(task.completed ? 'status.activated' : 'status.desactivated'),
        data: null
      })
    }

    return response.badRequest({
      message: lang.getMessage('param', 'type'),
      data: null
    })

  }

}
