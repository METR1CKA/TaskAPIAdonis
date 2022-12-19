import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MessagesI18n from 'App/Messages/MessagesI18n'
import Application from '@ioc:Adonis/Core/Application'
import { DateTime } from 'luxon'

export default class FilesController {

  public header = 'Accept-Language'

  public valids = {
    size: '20mb',
    extnames: [
      'jpg',
      'png',
      'jpeg',
      'gif',
      'svg',
      'mp4',
      'jfif',
    ]
  }

  public async uploadFiles({ request, response, params }: HttpContextContract) {

    const lang = new MessagesI18n(request.header(this.header))

    const file = request.file('file', this.valids)

    if (!file) {
      return
    }

    if (!file.isValid) {
      return response.badRequest({
        message: lang.messageC('', ''),
        data: {
          errors: file.errors
        }
      })
    }

    const filename = 'File_' + DateTime.now()

    await file.move(Application.resourcesPath('uploads'), {
      name: `${filename}.${file.extname}`,
      overwrite: true
    })

    return
  }

  public async getFile({}: HttpContextContract) {
    //
  }

}
