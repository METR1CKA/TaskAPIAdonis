import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from '../Users/User'

/** Componente schema de traducciones
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        user_id:
 *          type: number
 *        title:
 *          type: string
 *        description:
 *          type: string
 *        completed:
 *          type: boolean
 *        active:
 *          type: boolean
 *        created_at:
 *          type: string
 *          example: 'dd/MM/yyyy  HH:mm:ss'
 *        updated_at:
 *          type: string
 *          example: 'dd/MM/yyyy  HH:mm:ss'
 *        user:
 *          $ref: '#/components/schemas/User'
 */
export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public user_id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public completed: boolean

  @column()
  public active: boolean

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toFormat('dd-MM-yyyy  HH:mm:ss')
  })
  public createdAt?: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toFormat('dd-MM-yyyy  HH:mm:ss')
  })
  public updatedAt?: DateTime

  // Relations
  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  // STATUS
  public static STATUS = {
    C: true,
    I: false,
    A: true,
    D: false
  }

  public static COMPLETED_STATUS = ['C', 'I']

  public static ACTIVE_STATUS = ['A', 'D']
}
