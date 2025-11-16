import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.json('resource_interests').notNullable().defaultTo('[]')
      table.text('challenges_goals').nullable()
      table.string('preferred_contact_method').nullable()
      table.boolean('subscribes_to_newsletter').nullable()
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('resource_interests')
      table.dropColumn('challenges_goals')
      table.dropColumn('preferred_contact_method')
      table.dropColumn('subscribes_to_newsletter')
    })
  }
}