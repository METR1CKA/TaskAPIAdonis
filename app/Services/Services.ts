import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default class Services {
  constructor() {
    return this
  }

  private formatDate = 'dd-MM-yyyy  HH:mm:ss'

  private validations = Object.freeze({
    size: '50mb',
    extnames: [
      'jpg',
      'png',
      'jpeg',
      'gif',
      'svg',
      'jfif',
    ],
  })

  public getFormatDate(): string {
    return this.formatDate
  }

  public getFileValidations() {
    return this.validations
  }

  public logsOfDeveloper(Err: any): void {
    if (Env.get('NODE_ENV') == 'development') console.log(Err)
  }

  public generateSlug({ value, separator, extname }): string {
    value = value.toLowerCase()
    value = value.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,<>.?\s]/g, ' ')
    value = value.replace(extname, '')
    value = value.replace(/^\s+|\s+$/gm, '')
    value = value.replace(/\s+/g, separator)
    return value
  }

  public async storeFile(file: MultipartFileContract): Promise<string> {
    const { clientName } = file

    const { extnames } = this.validations

    const extname = extnames.find(extn => clientName.includes(`.${extn}`))

    const slugCurrentName = this.generateSlug({
      value: clientName,
      separator: '_',
      extname
    })

    const newfilename = `File_${slugCurrentName}.${extname}`

    await file.move(Application.resourcesPath('uploads'), {
      name: newfilename,
      overwrite: true
    })

    return newfilename
  }
}
