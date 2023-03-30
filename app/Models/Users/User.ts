import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasOne, HasOne, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'
import Role from './Role'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public active: boolean

  @column()
  public role_id: number

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
