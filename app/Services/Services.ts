import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { DateTime } from 'luxon'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default class Services {

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   * @returns The object itself.
   */
  constructor() {
    return this
  }

  /**
   * It takes a string, replaces all non-alphanumeric characters with spaces, trims the spaces,
   * replaces the spaces with underscores, and returns the result.
   * @param {string} value - string - The string you want to convert to a slug
   * @returns A string with all the special characters removed and replaced with a space.
   */
  public generateSlug(value: string) {
    value = value.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,<>.?\s]/g, ' ').toLowerCase()
    value = value.replace(/^\s+|\s+$/gm, '')
    value = value.replace(/\s+/g, '_')
    return value
  }

  /**
   * If the environment is development, then log the error, otherwise do nothing
   * @param {any} Err - The error that you want to log.
   */
  public logsOfDeveloper(Err: any) {
    Env.get('NODE_ENV') === 'development' ? console.log(Err) : null
  }

  /**
   * It takes a file and an array of file extensions, and then it moves the file to a folder called
   * uploads, and then it returns the new filename.
   * @param {MultipartFileContract} file - MultipartFileContract - This is the file that you want to
   * store.
   * @param {string[]} extnames - string[] = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
   * 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'txt', 'csv', ...]
   * @returns The newfilename is being returned.
   */
  public async storeFile(file: MultipartFileContract, extnames: string[]) {
    let newfilename: string = ''

    const currentname = file.clientName

    extnames.forEach(element => {
      const extname = `.${element}`

      if (currentname.includes(extname)) {
        const now = DateTime.now()

        const name = this.generateSlug(currentname)

        newfilename = `File_` + now + `_${name}${extname}`
      }
    })

    await file.move(Application.resourcesPath('uploads'), { name: newfilename, overwrite: true })

    return newfilename
  }
}