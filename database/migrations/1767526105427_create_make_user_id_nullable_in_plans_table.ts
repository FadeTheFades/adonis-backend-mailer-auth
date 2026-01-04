import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'create_land_stewardship_plans'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('user_id')
      table.integer('user_id').unsigned().nullable().alter()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.string('edit_token').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('edit_token')
      table.dropForeign('user_id')
      table.integer('user_id').unsigned().notNullable().alter()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
    })
  }
}