import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import { DateTime } from 'luxon'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import I18n from '@ioc:Adonis/Addons/I18n'

export default class Services {

  /* A private property of the class. */
  public locale: any

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
   * 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'tif', 'txt', 'csv',
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

  /**
 * If the key and context are passed in, return the key with the context formatted. If the key and
 * data are passed in, return the key with the data formatted. If only the key is passed in, return
 * the key formatted
 * @param {string} key - The key of the message you want to translate
 * @param {string} [context] - The context of the message.
 * @param {any} [data] - {
 * @returns The return value is a string.
 */
  public getMessage(key: string, context?: string, data?: any) {

    if (key && context) {
      return I18n.locale(this.locale).formatMessage(key, {
        data: I18n.locale(this.locale).formatMessage(context)
      })
    }

    if (key && data) {
      return I18n.locale(this.locale).formatMessage(key, data)
    }

    return I18n.locale(this.locale).formatMessage(key)
  }

  /**
 * It takes an error object and returns a string
 * @param {any} Err - any - The error object that is returned from the server
 * @returns The return value is a string.
 */
  public validationErr(Err: any) {
    const rule = Err.messages.errors[0].rule
    const field = Err.messages.errors[0].field

    if (rule == 'email') {
      return this.getMessage('email')
    }

    if (rule == 'required') {
      return this.getMessage('field', undefined, { field })
    }

    if (rule == 'confirmed') {
      return this.getMessage('field.confirm', undefined, { field })
    }

    if (rule == 'maxLength') {
      const args = Err.messages.errors[0].args.maxLength

      return this.getMessage('maxLength', undefined, { field, args })
    }

    return this.getMessage('field.type', undefined, { field, type: rule })
  }
}