import { BaseMail } from '@adonisjs/mail'
import Order from '#models/order'
import EventTicket from '#models/event_ticket'
import { DateTime } from 'luxon'

export default class OrderConfirmationEmail extends BaseMail {
  from = 'noreply@tasfrl.org'

  constructor(
    private order: Order,
    private tickets: EventTicket[]
  ) {
    super()
  }

  /**
   * The "to" address for this mailable
   */
  declare to: string

  /**
   * The "subject" of this mailable
   */
  declare subject: string

  /**
   * The "prepare" method to prepare the email message
   */
  prepare() {
    this.to = this.order.customerEmail || ''
    this.subject = `Order Confirmation - ${this.order.eventTitle}`

    const formattedDate = this.order.eventDate
      ? this.order.eventDate.toFormat('MMMM dd, yyyy h:mm a')
      : 'TBA'

    const ticketsHtml = this.tickets
      .map(
        (ticket) => `
      <div style="border: 1px solid #ddd; padding: 20px; margin: 15px 0; border-radius: 8px; background-color: #f9f9f9;">
        <h3 style="margin: 0 0 10px 0; color: #333;">Ticket #${ticket.ticketNumber}</h3>
        <p style="margin: 5px 0; color: #666;">
          <strong>Status:</strong> ${ticket.status}
        </p>
        <p style="margin: 5px 0; color: #666;">
          <strong>QR Code:</strong> ${ticket.qrCode}
        </p>
        <div style="margin-top: 15px; padding: 15px; background-color: #fff; border: 2px solid #333; border-radius: 4px; text-align: center; font-family: monospace; font-size: 14px; word-break: break-all;">
          ${ticket.qrCode}
        </div>
      </div>
    `
      )
      .join('')

    const contentHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h1 style="margin: 0; color: #333;">Order Confirmation</h1>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Thank you for your purchase!</p>
      </div>

      <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Event Details</h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 4px;">
          <p style="margin: 0 0 10px 0;">
            <strong style="color: #333;">Event:</strong> ${this.order.eventTitle}
          </p>
          <p style="margin: 0 0 10px 0;">
            <strong style="color: #333;">Date & Time:</strong> ${formattedDate}
          </p>
          <p style="margin: 0 0 10px 0;">
            <strong style="color: #333;">Venue:</strong> ${this.order.eventVenue}
          </p>
          <p style="margin: 0;">
            <strong style="color: #333;">Quantity:</strong> ${this.order.quantity} ticket(s)
          </p>
        </div>
      </div>

      <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Your Tickets</h2>
        ${ticketsHtml}
      </div>

      <div style="background-color: #fff; border: 1px solid #ddd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">Order Summary</h2>
        
        <div style="border-top: 1px solid #eee; padding-top: 15px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span>Subtotal:</span>
            <span>${(this.order.subtotal / 100).toFixed(2)} ${this.order.currency.toUpperCase()}</span>
          </div>
          ${
            this.order.platformFee > 0
              ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Platform Fee:</span>
              <span>${(this.order.platformFee / 100).toFixed(2)} ${this.order.currency.toUpperCase()}</span>
            </div>`
              : ''
          }
          ${
            this.order.tax > 0
              ? `<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span>Tax:</span>
              <span>${(this.order.tax / 100).toFixed(2)} ${this.order.currency.toUpperCase()}</span>
            </div>`
              : ''
          }
          <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 1px solid #eee; padding-top: 8px;">
            <span>Total:</span>
            <span>${(this.order.totalPrice / 100).toFixed(2)} ${this.order.currency.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div style="background-color: #e8f4f8; border-left: 4px solid #0066cc; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 0; color: #0066cc;">
          <strong>Important:</strong> Present your tickets at the event entrance. You can show the QR codes on your mobile device or print them.
        </p>
      </div>

      <div style="text-align: center; color: #666; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px;">
        <p>Order ID: <strong>${this.order.id}</strong></p>
        <p>Order Date: ${DateTime.now().toFormat('MMMM dd, yyyy')}</p>
        <p style="margin-top: 15px;">
          If you have any questions, please contact us at <a href="mailto:support@tasfrl.org" style="color: #0066cc;">support@tasfrl.org</a>
        </p>
      </div>
    </div>
    `

    this.html(contentHtml)
  }
}
