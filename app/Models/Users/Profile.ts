import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Lang from './Lang'

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
