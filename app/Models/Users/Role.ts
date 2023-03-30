import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Role extends BaseModel {
  public static ROLES = {
    DEV: 1,
    ADMIN: 2,
    EDITOR: 3
  }

  /* public static async getRoles() {
    const roles = await Role.query()
      .select(['id', 'name'])
      .orderBy('id', 'asc')
  } */

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
}
