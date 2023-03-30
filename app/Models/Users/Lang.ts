import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Profile from './Profile'

export default class Lang extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  // Relations
  @hasMany(() => Profile, {
    localKey: 'id',
    foreignKey: 'lang_id'
  })
  public profiles: HasMany<typeof Profile>
}
