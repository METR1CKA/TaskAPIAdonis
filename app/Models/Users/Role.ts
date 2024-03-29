import { BaseModel, column, HasMany, hasMany, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import View from './View'
import RoleView from './RoleView'
import Database from '@ioc:Adonis/Lucid/Database'

/**
 * @swagger
 * components:
 *  schemas:
 *    RolesViews:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        active:
 *          type: boolean
 *        description:
 *          type: string
 *        views:
 *          type: array
 *          items:
 *            $ref: "#/components/schemas/View"
 *    Role:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        name:
 *          type: string
 *        active:
 *          type: boolean
 *        description:
 *          type: string
 *        users:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/User'
 *        views:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/View'
 *        role_views:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/RoleView'
 */
export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public active: boolean

  @column()
  public description: string

  // Functions
  public static async getRoles(): Promise<any> {
    const currentRoles = await Database.query()
      .from('roles')
      .select(['id', 'name'])
      .orderBy('id', 'asc')

    const values = currentRoles.map(role => Object.values(role).reverse())

    return Object.fromEntries(values)
  }

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
