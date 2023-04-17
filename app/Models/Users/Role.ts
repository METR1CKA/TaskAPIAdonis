import { BaseModel, column, HasMany, hasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import View from './View'
import RoleView from './RoleView'

export default class Role extends BaseModel {
  public static ROLES = {
    DEV: 1,
    ADMIN: 2,
    EDITOR: 3
  }

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public active: boolean

  @column()
  public description: string

  // Relations
  @hasMany(() => User, {
    localKey: 'id',
    foreignKey: 'role_id'
  })
  public users: HasMany<typeof User>

  @manyToMany(() => View, {
    localKey: 'id',
    pivotForeignKey: 'role_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'view_id',
    pivotTable: 'role_views',
  })
  public views: ManyToMany<typeof View>

  @hasMany(() => RoleView, {
    localKey: 'id',
    foreignKey: 'role_id',
  })
  public role_views: HasMany<typeof RoleView>
}
