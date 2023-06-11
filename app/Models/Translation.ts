import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Service from '@ioc:Adonis/Providers/Services'

/** Componente schema de traducciones
 * @swagger
 * components:
 *  schemas:
 *    Translation:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        locale:
 *          type: string
 *        key:
 *          type: string
 *        message:
 *          type: string
 *        created_at:
 *          type: string
 *          example: 'dd/MM/yyyy  HH:mm:ss'
 *        updated_at:
 *          type: string
 *          example: 'dd/MM/yyyy  HH:mm:ss'
 */
export default class Translation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public locale: string

  @column()
  public key: string

  @column()
  public message: string

  @column.dateTime({
    autoCreate: true,
    serialize: value => value!.toFormat(Service.formatDate)
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: value => value!.toFormat(Service.formatDate)
  })
  public updatedAt: DateTime

  // Functions
  public static async updateKeys(data: any, locale: string) {
    await Translation.query()
      .where({ key: data.key, locale })
      .update({ message: data.name })

    await Translation.query()
      .where({ key: data.keyd, locale })
      .update({ message: data.description })
  }

  public static async createKeys(data: any, locales: string[]) {
    const { key, name, keyd, description } = data
    const keys = locales.map(locale => {
      return {
        locale,
        key,
        message: name
      }
    })

    const keysd = locales.map(locale => {
      return {
        locale,
        key: keyd,
        message: description
      }
    })

    await Translation.createMany(keys)
    await Translation.createMany(keysd)
  }
}
