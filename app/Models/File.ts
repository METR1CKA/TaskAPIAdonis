import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Task from './Tasks/Task'
import User from './Users/User'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public task_id: number

  @column()
  public user_id: number

  @column()
  public filename: string

  @column()
  public extname: string

  @column()
  public mime: string

  @column()
  public fullpath: string

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

  @belongsTo(() => User, {
    localKey: 'id',
    foreignKey: 'user_id'
  })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Task, {
    localKey: 'id',
    foreignKey: 'task_id'
  })
  public task: BelongsTo<typeof Task>
}
