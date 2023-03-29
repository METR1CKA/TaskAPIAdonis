import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Translations extends BaseSchema {
  protected tableName = 'translations'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('locale', 10).notNullable()
      table.string('key').notNullable()
      table.text('message', 'longtext').notNullable()

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.unique(['locale', 'key'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
