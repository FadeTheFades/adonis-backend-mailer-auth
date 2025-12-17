import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_tickets'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('order_id').unsigned().notNullable().references('id').inTable('orders').onDelete('CASCADE')
      table.string('event_id', 255).notNullable()
      table.string('ticket_number', 100).notNullable().unique()
      table.string('qr_code', 500).notNullable().unique()
      table.enum('status', ['valid', 'used', 'cancelled']).notNullable().defaultTo('valid')
      table.timestamp('used_at').nullable()
      
      table.timestamp('created_at')
      table.timestamp('updated_at')
      
      // Add index for faster queries
      table.index(['order_id'])
      table.index(['event_id'])
      table.index(['status'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
