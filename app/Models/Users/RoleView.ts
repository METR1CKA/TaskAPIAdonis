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

  // Functions

  public static async getRolesViews(): Promise<Role[]> {
    let roles_views: any[] = []

    const roles = await Role.all()

    for (const role of roles) {
      const { id, name } = role

      const new_role = await Role.query()
        .preload('views', view => {
          view
            .preload('role_views', rv => {
              rv
                .where('role_views.role_id', id)
                .where('role_views.active', true)
            })
            .where('role_views.active', true)
            .orderBy('views.order_index', 'asc')
        })
        .where({ id, name })
        .first()

      roles_views.push(new_role)
    }

    return roles_views
  }

  public static async sync(role: Role, views: number[]) {
    const roles_views = await RoleView.query()
      .where({ role_id: role.id })

    const rv_views_ids = roles_views.map(rv => rv.view_id)

    const deletable = roles_views
      .filter(rv => rv.active && !views.includes(rv.view_id))
      .map(drv => drv.id)

    const addable = views
      .filter(view => !rv_views_ids.includes(view))
      .map(view_id => {
        return {
          role_id: role.id,
          view_id,
          active: true
        }
      })

    const editable = roles_views
      .filter(rv => !rv.active && views.includes(rv.view_id))
      .map(erv => erv.id)

    await this.query()
      .whereIn('id', deletable)
      .update({ active: false })

    await this.query()
      .whereIn('id', editable)
      .update({ active: true })

    await this.createMany(addable)
  }
}
