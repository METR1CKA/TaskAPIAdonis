import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Role from './Role'
import Service from '@ioc:Adonis/Providers/Services'

/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        email:
 *          type: string
 *        rememberMeToken:
 *          type: string
 *          nullable: true
 *        active:
 *          type: boolean
 *        created_at:
 *          type: string
 *          example: 'dd-MM-yyyy  HH:mm:ss'
 *        updated_at:
 *          type: string
 *          example: 'dd-MM-yyyy  HH:mm:ss'
 *        profile:
 *          $ref: '#/components/schemas/Profile'
 *        role:
 *          $ref: '#/components/schemas/Role'
 */
export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column({ serializeAs: null })
  public rememberMeToken?: string | null

  @column()
  public active: boolean

  @column({ serializeAs: null })
  public role_id: number

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toFormat(Service.formatDate)
  })
  public createdAt?: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toFormat(Service.formatDate)
  })
  public updatedAt?: DateTime

  // Functions
  @beforeSave()
  public static async hashPassword(User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password)
    }
  }

  // Relations
  @hasOne(() => Profile, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public profile: HasOne<typeof Profile>

  @belongsTo(() => Role, {
    localKey: 'id',
    foreignKey: 'role_id'
  })
  public role: BelongsTo<typeof Role>
}
