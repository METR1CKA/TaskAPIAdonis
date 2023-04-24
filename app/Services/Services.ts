import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'
import Application from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'

export default class Services {
  private res: any
  public formatDate = 'dd/MM/yyyy  HH:mm:ss'

  constructor() {
    return this
  }

  /**
   * It takes a string, replaces all non-alphanumeric characters with spaces, trims the spaces,
   * replaces the spaces with underscores, and returns the result.
   * @param {string} value - string - The string you want to convert to a slug
   * @returns A string with all the special characters removed and replaced with a space.
   */
  public generateSlug(value: string, separator: string) {
    value = value.replace(/[`~!@#$%^&*()_\-+=\[\]{};:'"\\|\/,.<>?\s]/g, ' ').toLowerCase()
    value = value.replace(/^\s+|\s+$/gm, '')
    value = value.replace(/\s+/g, separator)
    return value
  }

  /**
   * If the environment is development, then log the error, otherwise do nothing
   * @param {any} Err - The error that you want to log.
   */
  public logsOfDeveloper(Err: any) {
    if (Env.get('NODE_ENV') == 'development') { console.log(Err) }
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
    let newfilename = 'Filename'

    const currentname = file.clientName

    extnames.forEach(extn => {
      const extname = `.${extn}`

      if (currentname.includes(extname)) {
        newfilename = `File_${this.generateSlug(currentname, '_')}${extname}`
      }
    })

    await file.move(Application.resourcesPath('uploads'), { name: newfilename, overwrite: true })

    return newfilename
  }

  /**
   * This function sets the response object to the response object passed in.
   * @param {any} res - The response object from the server.
   */
  public setResponseObject(res: any): void {
    this.res = res
  }

  /**
   * It returns a JSON response with a status code and a message
   * @param {number} status - The HTTP status code
   * @param {string} message - string - The message you want to send to the client.
   * @param {any} [data] - any object = {}
   * @returns The response object is being returned.
   */
  public httpResponse(status: number, message: string, data?: any) {
    const json = {
      statusResponse: ((code: number): string => {
        if (code >= 100 && code < 200) return 'Info'
        if (code >= 200 && code < 300) return 'Success'
        if (code >= 300 && code < 400) return 'Redirect'
        if (code >= 400 && code < 500) return 'Client Error'
        if (code >= 500 && code < 600) return 'Server Error'
        return 'Default'
      })(status),
      data: { message }
    }

    json.data = Object.assign(json.data, data)

    return this.res.status(status).json(json)
  }
}
