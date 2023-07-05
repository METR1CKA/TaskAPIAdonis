import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Service from '@ioc:Adonis/Providers/Services'
import FileValidator from 'App/Validators/Tasks/FileValidator'

export default class FilesController {
  public async uploadFile({ request, response, i18n }: HttpContextContract) {
    try {
      await request.validate(FileValidator)
    } catch (validation) {
      Service.logsOfDeveloper(validation?.messages)

      const { messages: { errors: [error] } } = validation

      return response.badRequest({
        statusResponse: 'Client error',
        data: {
          message: error?.message
        }
      })
    }

    const file = request.file('file')!

    const filename = await Service.storeFile(file)

    return response.created({
      statusResponse: 'success',
      data: {
        message: i18n.formatMessage('file'),
        filename
      }
    })
  }

  public async getFile({ response, filename }) {
    return response.stream(
      await Drive.getStream(filename)
    )
  }

  public async deleteFile({ response, i18n, filename }) {
    await Drive.delete(filename)

    return response.ok({
      statusResponse: 'Success',
      data: {
        message: i18n.formatMessage('file.deleted')
      }
    })
  }

  public async files({ request, response, params, i18n }: HttpContextContract) {
    const { filename } = params

    if (!await Drive.exists(filename)) {
      return response.notFound({
        statusResponse: 'Client error',
        data: {
          message: i18n.formatMessage('file.notExists'),
        }
      })
    }

    return request.method() == 'DELETE'
      ? this.deleteFile({ response, i18n, filename })
      : this.getFile({ response, filename })
  }
}
