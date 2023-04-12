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
      'mp4',
      'jfif',
      'pdf',
      'bin',
      'txt',
      'doc',
      'docx',
      'avi',
      'mp3',
      'wav',
      'zip',
      'rar',
      'tar',
      'ico',
      'xsl',
      'xlsx',
      'pptx',
      'ppt',
      'csv',
      'rtf',
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
      return Service.httpResponse(400, this.getMessage('file.extnames'), {
        errors: file.errors,
        validations: this.validations
      })
    }

    const filename = await Service.storeFile(file, this.validations.extnames)

    return Service.httpResponse(201, this.getMessage('file'), {
      filename
    })
  }

  public async getFile({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const { filename } = params

    const existsFile = await Drive.exists(filename)

    if (!existsFile) {
      return Service.httpResponse(404, this.getMessage('file.notExists'), {
        existsFile
      })
    }

    const file = await Drive.getStream(filename)

    return response.stream(file)
  }

  public async deleteFile({ request, response, params }: HttpContextContract) {
    this.setLocaleRequest(request)
    Service.setResponseObject(response)

    const { filename } = params

    const existsFile = await Drive.exists(filename)

    if (!existsFile) {
      return Service.httpResponse(404, this.getMessage('file.notExists'), {
        existsFile
      })
    }

    await Profile.query().where({ image: filename }).update({ image: null })

    await Drive.delete(filename)

    return Service.httpResponse(200, this.getMessage('file.deleted'))
  }
}
