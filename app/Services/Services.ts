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

  public generateFileSlug({ value, separator, extname }): string {
    return value
      .toLowerCase()
      .replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,<>.?\s]/g, ' ')
      .replace(extname, '')
      .replace(/^\s+|\s+$/gm, '')
      .replace(/\s+/g, separator)
  }

  public async storeFile(file: MultipartFileContract): Promise<string> {
    const { clientName } = file

    const { extnames } = this.getFileValidations()

    const extname = extnames.find(extn => clientName.includes(`.${extn}`))

    const slugCurrentName = this.generateFileSlug({
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
