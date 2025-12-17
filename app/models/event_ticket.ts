import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Order from '#models/order'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class EventTicket extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare orderId: number

  @column()
  declare eventId: string

  @column()
  declare ticketNumber: string

  @column()
  declare qrCode: string

  @column()
  declare status: 'valid' | 'used' | 'cancelled'

  @column()
  declare usedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relations
  @belongsTo(() => Order)
  declare order: BelongsTo<typeof Order>

  /**
   * Generate a unique ticket number
   */
  static generateTicketNumber(): string {
    const timestamp = Date.now().toString().slice(-8)
    const random = Math.random().toString(36).substring(2, 7).toUpperCase()
    return `TKT-${DateTime.now().year}-${timestamp}${random}`
  }

  /**
   * Generate a unique QR code identifier
   */
  static generateQRCode(): string {
    return `QR-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
  }
}
