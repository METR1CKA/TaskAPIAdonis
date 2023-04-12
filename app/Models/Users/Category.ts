import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import View from './View'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public active: boolean

  @column()
  @slugify({
    strategy: 'shortId',
    maxLength: 100,
    fields: ['name']
  })
  public key: string

  @column()
  public name: string

  @column()
  public order_index: number

  @column()
  @slugify({
    strategy: 'shortId',
    maxLength: 100,
    fields: ['description']
  })
  public keyd: string

  @column()
  public description: string

  // Relation
  @hasMany(() => View, {
    localKey: 'id',
    foreignKey: 'view_id'
  })
  public views: HasMany<typeof View>
}