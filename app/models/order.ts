import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import EventTicket from '#models/event_ticket'
import type { HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare shippingAddressId: number | null

  @column()
  declare billingAddressId: number | null

  @column()
  declare totalPrice: number

  @column()
  declare discountId: number | null

  @column()
  declare status: string

  @column()
  declare xenditTransactionId: string | null

  @column()
  declare shippingMethodId: number | null

  // Stripe fields
  @column()
  declare stripeSessionId: string | null

  @column()
  declare stripePaymentIntentId: string | null

  @column()
  declare eventId: string | null

  @column()
  declare eventTitle: string | null

  @column()
  declare eventDate: DateTime | null

  @column()
  declare eventVenue: string | null

  @column()
  declare quantity: number

  @column()
  declare customerEmail: string | null

  @column()
  declare customerName: string | null

  @column()
  declare platformFee: number

  @column()
  declare tax: number

  @column()
  declare currency: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => EventTicket)
  declare tickets: HasMany<typeof EventTicket>

  get subtotal() {
    return this.totalPrice - this.platformFee - this.tax
  }
}
