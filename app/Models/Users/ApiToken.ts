import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Service from '@ioc:Adonis/Providers/Services'

export default class ApiToken extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public tokenNoHash: string

  @column()
  public token: string

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toFormat(Service.getFormatDate())
  })
  public expires_at?: DateTime

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toFormat(Service.getFormatDate())
  })
  public createdAt?: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toFormat(Service.getFormatDate())
  })
  public updatedAt?: DateTime

  // Relations
  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>
}
