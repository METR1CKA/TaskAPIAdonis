import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from '../Users/User'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
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
}
