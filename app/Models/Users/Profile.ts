import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Lang from './Lang'

/**
 * @swagger
 * components:
 *  schemas:
 *    Profile:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        user_id:
 *          type: number
 *        lang_id:
 *          type: number
 *        name:
 *          type: string
 *        lastname:
 *          type: string
 *        phone:
 *          type: string
 *        address:
 *          type: string
 *        image:
 *          type: string
 *        user:
 *          $ref: '#/components/schemas/User'
 *        lang:
 *          $ref: '#/components/schemas/Lang'
 */
export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public lang_id: number

  @column()
  public name: string

  @column()
  public lastname: string

  @column()
  public phone?: string

  @column()
  public address?: string

  @column()
  public image?: string

  // Relations
  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Lang, {
    localKey: 'id',
    foreignKey: 'lang_id',
  })
  public lang: BelongsTo<typeof Lang>
}
