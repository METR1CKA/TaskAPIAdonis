import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'
import Profile from 'App/Models/Users/Profile'

export default class FilesController extends MessagesI18n {
  public validations = {
    size: '50mb',
    extnames: [
      'jpg',
      'png',
      'jpeg',
      'gif',
      'svg',
      'jfif',
    ],
  }

  public async uploadFile({ request, response }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const file = request.file('file', this.validations)

    if (!file) {
      return Service.httpResponse(204, this.getMessage('nocontent'))
    }

    if (!file.isValid) {
      const errMessage = this.validationErrFile(file.errors[0].type, this.validations)

      return Service.httpResponse(400, errMessage)
    }

    const filename = await Service.storeFile(file, this.validations.extnames)

    return Service.httpResponse(201, this.getMessage('file'), {
      filename
    })
  }

  public async files({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const { filename } = params

    const existsFile = await Drive.exists(filename)

    if (!existsFile) {
      return Service.httpResponse(404, this.getMessage('file.notExists'), {
        existsFile
      })
    }

    if (request.method() == 'DELETE') {
      await Profile.query().where({ image: filename }).update({ image: null })

      await Drive.delete(filename)

      return Service.httpResponse(200, this.getMessage('file.deleted'))
    }

    const file = await Drive.getStream(filename)

    return response.stream(file)
  }
}
