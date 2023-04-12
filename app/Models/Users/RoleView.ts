import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import View from './View'

export default class RoleView extends BaseModel {
  // public static table = 'roles_views'

  @column({ isPrimary: true })
  public id: number

  @column()
  public role_id: number

  @column()
  public view_id: number

  @column()
  public active: boolean

  @belongsTo(() => Role, {
    localKey: 'id',
    foreignKey: 'role_id',
  })
  public role: BelongsTo<typeof Role>

  @belongsTo(() => View, {
    localKey: 'id',
    foreignKey: 'view_id',
  })
  public view: BelongsTo<typeof View>
}
