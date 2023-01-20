import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import Service from '@ioc:Adonis/Providers/Services'
import MessagesI18n from 'App/Services/MessagesI18n'
import File from 'App/Models/File'

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

  public async uploadFile({ request, response, params }: HttpContextContract) {
    this.locale = request.header(this.header)

    if (!request.input('type')) {
      return response.badRequest({
        message: this.getMessage('param', 'type'),
        data: null
      })
    }

    const file = request.file('file', this.validations)

    if (!file) {
      return
    }

    if (!file.isValid) {
      return response.badRequest({
        message: this.getMessage('file.extnames'),
        data: {
          errors: file.errors
        }
      })
    }

    const filename = await Service.storeFile(file, this.validations.extnames)

    const idOrNull = request.input('type') == 'task' || request.input('type') == 'user'
      ? params.id
      : null

    await File.create({
      task_id: idOrNull,
      user_id: idOrNull,
      filename,
      extname: file.extname,
      mime: file.headers['content-type'],
      fullpath: `uploads/${filename}`
    })

    return response.created({
      message: this.getMessage('file'),
      data: null
    })
  }

  public async getFile({ request, response, params }: HttpContextContract) {
    this.locale = request.header(this.header)

    const filename: string = params.filename

    if (!await Drive.exists(filename)) {
      return response.notFound({
        message: this.getMessage('file.notExists'),
        data: null
      })
    }

    const _file = await File.findBy('filename', filename)

    if (!_file) {
      return response.notFound({
        message: this.getMessage('file.notExists'),
        data: null
      })
    }

    if (request.input('download')) {
      return response.attachment(`resources/uploads/${filename}`)
    }

    response.header('content-type', _file.mime)

    const file = await Drive.getStream(filename)

    return response.stream(file)
  }

  public async deleteFile({ request, response, params }: HttpContextContract) {
    this.locale = request.header(this.header)

    const filename: string = params.filename

    if (!await Drive.exists(filename)) {
      return response.notFound({
        message: this.getMessage('file.notExists'),
        data: null
      })
    }

    const _file = await File.findBy('filename', filename)

    if (!_file) {
      return response.notFound({
        message: this.getMessage('file.notExists'),
        data: null
      })
    }

    await _file.delete()

    await Drive.delete(filename)

    return response.ok({
      message: this.getMessage('file.deleted'),
      data: null
    })
  }
}
