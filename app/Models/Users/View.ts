import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import RoleView from './RoleView'
import Role from './Role'

export default class View extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public category_id: number

  @column()
  public active: boolean

  @column()
  public key: string

  @column()
  public name: string

  @column()
  public order_index: number

  @column()
  public url: string

  @column()
  public description?: string

  // Relation
  @belongsTo(() => View, {
    localKey: 'id',
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof View>

  @hasMany(() => RoleView, {
    localKey: 'id',
    foreignKey: 'view_id'
  })
  public views: HasMany<typeof RoleView>

  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'view_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'roles_views',
  })
  public role: ManyToMany<typeof Role>
}
