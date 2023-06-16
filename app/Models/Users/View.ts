import { BaseModel, BelongsTo, HasMany, ManyToMany, belongsTo, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import RoleView from './RoleView'
import Role from './Role'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'

/**
 * @swagger
 * components:
 *  schemas:
 *    View:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        category_id:
 *          type: number
 *        active:
 *          type: boolean
 *        key:
 *          type: string
 *        name:
 *          type: string
 *        order_index:
 *          type: number
 *        url:
 *          type: string
 *        keyd:
 *          type: string
 *        description:
 *          type: string
 *        category:
 *          $ref: '#/components/schemas/Category'
 *        role_views:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/RoleView'
 *        role:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Role'
 */
export default class View extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ serializeAs: null })
  public category_id: number

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
  public url: string

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
  @belongsTo(() => View, {
    localKey: 'id',
    foreignKey: 'category_id',
  })
  public category: BelongsTo<typeof View>

  @hasMany(() => RoleView, {
    localKey: 'id',
    foreignKey: 'view_id'
  })
  public role_views: HasMany<typeof RoleView>

  @manyToMany(() => Role, {
    localKey: 'id',
    pivotForeignKey: 'view_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'role_id',
    pivotTable: 'role_views',
  })
  public role: ManyToMany<typeof Role>
}
