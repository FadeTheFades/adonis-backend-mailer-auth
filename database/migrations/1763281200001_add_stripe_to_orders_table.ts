import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('stripe_session_id', 255).unique().nullable()
      table.string('stripe_payment_intent_id', 255).unique().nullable()
      table.string('event_id', 255).nullable()
      table.string('event_title', 255).nullable()
      table.dateTime('event_date').nullable()
      table.string('event_venue', 500).nullable()
      table.integer('quantity').nullable().defaultTo(1)
      table.string('customer_email', 255).nullable()
      table.string('customer_name', 255).nullable()
      table.integer('platform_fee').nullable().defaultTo(0)
      table.integer('tax').nullable().defaultTo(0)
      table.string('currency', 3).notNullable().defaultTo('usd')
      
      // Add index for faster queries
      table.index(['stripe_session_id'])
      table.index(['event_id'])
      table.index(['customer_email'])
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropIndex(['stripe_session_id'])
      table.dropIndex(['event_id'])
      table.dropIndex(['customer_email'])
      table.dropColumn('stripe_session_id')
      table.dropColumn('stripe_payment_intent_id')
      table.dropColumn('event_id')
      table.dropColumn('event_title')
      table.dropColumn('event_date')
      table.dropColumn('event_venue')
      table.dropColumn('quantity')
      table.dropColumn('customer_email')
      table.dropColumn('customer_name')
      table.dropColumn('platform_fee')
      table.dropColumn('tax')
      table.dropColumn('currency')
    })
  }
}
