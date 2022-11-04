import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

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
    serialize: (value) => value?.toFormat('dd/MM/yyyy  HH:mm:ss')
  })
  public createdAt: DateTime

  @column.dateTime({
    autoCreate: true,
    autoUpdate: true,
    serialize: (value) => value?.toFormat('dd/MM/yyyy  HH:mm:ss')
  })
  public updatedAt: DateTime
}
