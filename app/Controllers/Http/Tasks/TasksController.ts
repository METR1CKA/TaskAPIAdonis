import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import Task from 'App/Models/Tasks/Task'
import TasksUpdateValidator from 'App/Validators/Tasks/TasksUpdateValidator'
import TaskValidator from 'App/Validators/Tasks/TaskValidator'

export default class TasksController {

  public header = 'Accept-Language'

  public async read(ctx: HttpContextContract) {

    const lang = new MessagesI18n(ctx.request.header(this.header))

    const tasks = await Task.query()
      .preload('user')
      .preload('files')
      .orderBy('id', 'desc')

    if (ctx.params.id) {

      return await this.get(ctx, tasks, lang)

    }

    return ctx.response.ok({
      message: lang.messageC('messages.success.all', 'tasks'),
      data: {
        total: tasks.length,
        tasks
      }
    })

  }

  public async get(ctx: HttpContextContract, tasks: Task[], lang: MessagesI18n) {

    const task = tasks.find(element => element.id == ctx.params.id)

    return task
      ? ctx.response.ok({
        message: lang.messageC('messages.success.one', 'task'),
        data: {
          task
        }
      })
      : ctx.response.notFound({
        message: lang.messageC('messages.errors.notFound', 'task'),
        data: null
      })
  }

  public async create({ request, response }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    try {

      const vali = await request.validate(TaskValidator)

      if (!vali) {
        return
      }

      const task = await Task.create({
        user_id: vali.user_id,
        title: vali.title,
        description: vali.description,
        completed: false
      })

      return response.created({
        message: lang.messageC('messages.success.create', 'user'),
        data: {
          task
        }
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

  public async update({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const task = await Task.find(params.id)

    if (!task) {
      return response.notFound({
        message: lang.messageC('messages.errors.notFound', 'task'),
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
        message: lang.messageC('messages.success.update', 'task'),
        data: {
          task
        }
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
        message: lang.messageC('messages.errors.notFound', 'task'),
        data: null
      })
    }

    if (request.input('type') == 'delete') {
      await task.delete()

      return response.ok({
        message: lang.messageC('messages.success.delete', 'task'),
        data: null
      })
    }

    if (request.input('type') == 'complete') {
      await task.merge({ completed: !task.completed }).save()

      return response.ok({
        message: lang.messageC('messages.success.status', 'task'),
        data: null
      })
    }

    return response.badRequest({
      message: lang.messageC('messages.errors.param', 'type'),
      data: null
    })

  }

}
