import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'land_stewardship_plans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE')

      table.string('full_name').nullable()
      table.string('phone_number').nullable()
      table.string('email').nullable()
      table.boolean('is_returning_steward').defaultTo(false)

      table.string('county').nullable()
      table.string('property_address').nullable()
      table.decimal('approximate_acreage', 10, 2).nullable()
      table.string('primary_current_land_use').nullable()
      table.json('land_management_goals').defaultTo('[]')
      table.string('other_goals_text').nullable()

      table.text('gate_access_notes').nullable()
      table.text('known_utilities').nullable()
      table.text('hazards_awareness').nullable()
      table.string('gps_pin_link').nullable()
      table.json('uploaded_photos').defaultTo('[]')
      table.string('map_screenshot_path').nullable()

      table.boolean('agrees_to_contact').defaultTo(false)
      table.boolean('subscribes_to_newsletter').defaultTo(false)
      table.boolean('agrees_to_sms').defaultTo(false)

      table.integer('current_step').defaultTo(1)
      table.string('case_number').nullable()
      table.enum('status', ['draft', 'submitted', 'reviewed']).defaultTo('draft')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}