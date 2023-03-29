import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'profiles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').references('id').inTable('users').unsigned().onDelete('CASCADE')
      table.integer('lang_id').references('id').inTable('langs').unsigned().onDelete('CASCADE')
      table.string('name', 250).notNullable()
      table.string('lastname', 250).notNullable()
      table.string('phone', 10).nullable()
      table.text('address').nullable()
      table.string('image', 250).nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
