import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Service from '@ioc:Adonis/Providers/Services'
import I18n from '@ioc:Adonis/Addons/I18n'

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
    serialize: value => value?.toFormat(Service.formatDate)
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: value => value?.toFormat(Service.formatDate)
  })
  public updatedAt: DateTime

  // Functions
  public static async updateKeys(data: any, locale: string) {
    const { key, name, keyd, description } = data

    await Translation.query()
      .where({ key, locale })
      .update({ message: name })

    await Translation.query()
      .where({ key: keyd, locale })
      .update({ message: description })

    await I18n.reloadTranslations()
  }

  public static async createKeys(data: any) {
    const locales = I18n.supportedLocales()

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

    await I18n.reloadTranslations()
  }
}
