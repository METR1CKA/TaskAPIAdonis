import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import Service from '@ioc:Adonis/Providers/Services'

/** Componente schema de traducciones
 * @swagger
 * components:
 *  schemas:
 *    Translations:
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
}
