import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import File from '../File'

export default class Profile extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

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

  @column.dateTime({
    autoCreate: true,
    serialize: (value) => value?.toFormat('dd/MM/yyyy  HH:mm:ss')
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toFormat('dd/MM/yyyy  HH:mm:ss')
  })
  public updatedAt: DateTime

  // Relations

  @hasOne(() => File, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public img: HasOne<typeof File>

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>
}
