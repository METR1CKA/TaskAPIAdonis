import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'views'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('category_id').references('id').inTable('categories').unsigned().onDelete('CASCADE')
      table.string('key', 150).notNullable()
      table.string('name', 100).notNullable()
      table.integer('order_index').notNullable()
      table.string('url', 100).notNullable()
      table.text('description', 'longtext').notNullable()
      table.boolean('active').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      // table.timestamp('created_at', { useTz: true })
      // table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
