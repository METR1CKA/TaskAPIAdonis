import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Task from './Task'

export default class File extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public task_id: number

  @column()
  public filename: number

  @column()
  public extname: number

  @column()
  public mime: number

  @column()
  public fullpath: number

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

  @belongsTo(() => Task, {
    localKey: 'id',
    foreignKey: 'task_id'
  })
  public task: BelongsTo<typeof Task>
}
