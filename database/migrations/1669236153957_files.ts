import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('task_id').references('id')
        .inTable('tasks').unsigned().onDelete('CASCADE')
      table.string('filename', 200).notNullable()
      table.string('extname', 10).notNullable()
      table.string('mime', 100).notNullable()
      table.string('fullpath', 200).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
