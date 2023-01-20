import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Service from '@ioc:Adonis/Providers/Services'

export default class FilesController {
  public header = 'Accept-Language'

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
    Service.locale = request.header(this.header)

    const file = request.file('file', this.validations)

    if (!file) {
      return
    }

    if (!file.isValid) {
      return response.badRequest({
        message: Service.getMessage('file.extnames'),
        data: {
          errors: file.errors
        }
      })
    }

    const filename = await Service.storeFile(file, this.validations.extnames)

    return response.created({
      message: Service.getMessage('file'),
      data: {
        filename,
      }
    })
  }

  public async getFile({ request, response, params }: HttpContextContract) {
    Service.locale = request.header(this.header)

    const filename: string = params.filename

    if (!await Drive.exists(filename)) {
      return response.notFound({
        message: Service.getMessage('file.notExists'),
        data: null
      })
    }

    if (request.input('download')) {
      return response.attachment(`resources/uploads/${filename}`)
    }

    const file = await Drive.getStream(filename)

    return response.stream(file)
  }

  public async deleteFile({ request, response, params }: HttpContextContract) {
    Service.locale = request.header(this.header)

    const filename: string = params.filename

    if (!await Drive.exists(filename)) {
      return response.notFound({
        message: Service.getMessage('file.notExists'),
        data: null
      })
    }

    await Drive.delete(filename)

    return response.ok({
      message: Service.getMessage('file.deleted'),
      data: null
    })
  }
}
