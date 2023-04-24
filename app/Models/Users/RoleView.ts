import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'
import View from './View'

/**
 * @swagger
 * components:
 *  schemas:
 *    RoleView:
 *      type: object
 *      properties:
 *        id:
 *          type: number
 *        role_id:
 *          type: number
 *        view_id:
 *          type: number
 *        active:
 *          type: boolean
 *        role:
 *          $ref: '#/components/schemas/Role'
 *        view:
 *          $ref: '#/components/schemas/View'
 */
export default class RoleView extends BaseModel {
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
