import { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import Stripe from 'stripe'
import Order from '#models/order'
import EventTicket from '#models/event_ticket'
import { DateTime } from 'luxon'
import logger from '@adonisjs/core/services/logger'

const stripe = new Stripe(env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2025-11-17.clover',
})

export default class StripeController {
  /**
   * Create a Stripe checkout session with event ticket information
   * POST /api/stripe/checkout
   */
  async checkout({ request, response, auth }: HttpContext) {
    try {
      logger.info('📋 [CHECKOUT] Starting checkout session creation')
      
      // Validate required fields
      const payload = request.only([
        'amount',
        'currency',
        'successUrl',
        'cancelUrl',
        'eventId',
        'eventTitle',
        'eventDate',
        'eventVenue',
        'quantity',
        'customerEmail',
      ])

      const {
        amount,
        currency = 'usd',
        successUrl,
        cancelUrl,
        eventId,
        eventTitle,
        eventDate,
        eventVenue,
        quantity = 1,
        customerEmail,
      } = payload

      logger.info(`📋 [CHECKOUT] Payload received: amount=${amount}, currency=${currency}, eventId=${eventId}`)

      // Validation
      if (!amount || amount <= 0) {
        logger.error('📋 [CHECKOUT] Invalid amount provided')
        return response.status(400).json({ error: 'Invalid amount' })
      }

      if (!successUrl || !cancelUrl) {
        logger.error('📋 [CHECKOUT] Missing redirect URLs')
        return response.status(400).json({ error: 'Missing redirect URLs' })
      }

      if (!eventId || !eventTitle) {
        logger.error('📋 [CHECKOUT] Missing event details')
        return response.status(400).json({ error: 'Missing event details' })
      }

      // Require an authenticated user to satisfy non-nullable orders.user_id
      if (!auth?.user?.id) {
        logger.error('📋 [CHECKOUT] Not authenticated')
        return response.status(401).json({ error: 'Login required to checkout' })
      }

      const email = customerEmail || auth.user.email
      if (!email) {
        logger.error('📋 [CHECKOUT] No email available')
        return response.status(400).json({ error: 'Customer email is required' })
      }

      logger.info(`📋 [CHECKOUT] Creating order for user ${auth.user.id}, email: ${email}`)

      // Create pending order record
      const order = await Order.create({
        userId: auth.user.id,
        eventId,
        eventTitle,
        eventDate: eventDate ? DateTime.fromISO(eventDate) : null,
        eventVenue,
        quantity,
        customerEmail: email,
        customerName: auth.user.name || null,
        totalPrice: amount,
        status: 'pending',
        currency,
      })

      logger.info(`📋 [CHECKOUT] Order created with ID: ${order.id}`)

      // Create Stripe session with event metadata
      logger.info(`📋 [CHECKOUT] Creating Stripe session for order ${order.id}`)
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: eventTitle,
                description: `Event: ${eventTitle} at ${eventVenue}`,
              },
              unit_amount: amount,
            },
            quantity,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: email,
        metadata: {
          orderId: order.id.toString(),
          eventId,
          eventTitle,
          eventDate: eventDate || '',
          eventVenue,
          quantity: quantity.toString(),
        },
        // Enable automatic tax calculation if configured
        automatic_tax: {
          enabled: true,
        },
      })

      logger.info(`📋 [CHECKOUT] Stripe session created: ${session.id}`)

      // Update order with Stripe session ID
      order.stripeSessionId = session.id
      await order.save()

      logger.info(`📋 [CHECKOUT] Order updated with sessionId ${session.id}, returning URL: ${session.url}`)

      return response.json({
        sessionId: session.id,
        url: session.url,
        orderId: order.id,
      })
    } catch (error) {
      logger.error('Stripe checkout error:', error)
      return response.status(500).json({
        error: 'Failed to create checkout session',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Handle Stripe webhook events
   * POST /api/stripe/webhook
   */
  async webhook(ctx: HttpContext) {
    const { request, response } = ctx
    const sig = request.header('stripe-signature')
    let event
    let rawBody: string

    try {
      // Use the raw body captured by StripeWebhookMiddleware
      rawBody = (ctx as any).rawBodyForStripe || ''
      
      logger.info(`🔔 [WEBHOOK] Received webhook request. Sig header: ${sig ? 'present' : 'MISSING'}, Raw body length: ${rawBody.length}`)
      
      if (!rawBody) {
        logger.error('🔔 [WEBHOOK] No raw body captured for webhook signature verification')
        return response.status(400).json({
          error: 'Webhook Error',
          message: 'No webhook payload was provided.',
        })
      }
      
      logger.debug(`🔔 [WEBHOOK] Raw body first 200 chars: ${rawBody.substring(0, 200)}`)
      logger.debug({ rawBodyLength: rawBody.length, sig }, 'Raw webhook body ready for verification')
      
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig || '',
        env.get('STRIPE_WEBHOOK_SECRET') || ''
      )
      
      logger.info(`🔔 [WEBHOOK] Signature verified! Event type: ${event.type}, Event ID: ${event.id}`)
    } catch (err) {
      logger.error({ err }, '🔔 [WEBHOOK] Webhook signature verification failed:')
      return response.status(400).json({
        error: 'Webhook Error',
        message: `${err instanceof Error ? err.message : 'Unknown error'}`,
      })
    }

    try {
      // Handle different event types
      switch (event.type) {
        case 'checkout.session.completed': {
          logger.info('🔔 [WEBHOOK] Handling checkout.session.completed event')
          await this.handleCheckoutSessionCompleted(event.data.object as any)
          logger.info('🔔 [WEBHOOK] checkout.session.completed handled successfully')
          break
        }

        case 'payment_intent.payment_failed': {
          logger.info('🔔 [WEBHOOK] Handling payment_intent.payment_failed event')
          await this.handlePaymentFailed(event.data.object as any)
          logger.info('🔔 [WEBHOOK] payment_intent.payment_failed handled successfully')
          break
        }

        case 'charge.refunded': {
          logger.info('🔔 [WEBHOOK] Handling charge.refunded event')
          await this.handleRefund(event.data.object as any)
          logger.info('🔔 [WEBHOOK] charge.refunded handled successfully')
          break
        }

        default:
          logger.info(`🔔 [WEBHOOK] Unhandled event type ${event.type}`)
      }

      logger.info('🔔 [WEBHOOK] Returning 200 OK response')
      return response.json({ received: true })
    } catch (error) {
      logger.error({ error }, '🔔 [WEBHOOK] Webhook processing error:')
      return response.status(500).json({
        error: 'Webhook processing failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Handle checkout.session.completed event
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    logger.info('✅ [SESSION] Processing checkout.session.completed', {
      sessionId: session.id,
      metadata: session.metadata,
      paymentIntent: session.payment_intent,
    })

    const orderId = session.metadata?.orderId

    if (!orderId) {
      logger.error('✅ [SESSION] Missing orderId in session metadata', {
        sessionId: session.id,
        metadata: session.metadata,
      })
      return
    }

    logger.info(`✅ [SESSION] Looking up order: ${orderId}`)

    // Find the order
    const order = await Order.find(parseInt(orderId))

    if (!order) {
      logger.error(`✅ [SESSION] Order not found: ${orderId}`)
      return
    }

    logger.info(`✅ [SESSION] Found order ${order.id}, updating status to completed`)

    // Update order status to completed
    order.status = 'completed'
    order.stripePaymentIntentId = session.payment_intent as string
    order.customerEmail = session.customer_email || order.customerEmail
    await order.save()

    logger.info(`✅ [SESSION] Order ${order.id} updated successfully`, {
      status: order.status,
      paymentIntentId: order.stripePaymentIntentId,
    })

    // Create event tickets
    const ticketCount = parseInt(session.metadata?.quantity || '1')
    const tickets: EventTicket[] = []

    logger.info(`✅ [SESSION] Creating ${ticketCount} tickets for order ${order.id}`)

    for (let i = 0; i < ticketCount; i++) {
      const ticket = new EventTicket()
      ticket.orderId = order.id
      ticket.eventId = order.eventId || ''
      ticket.ticketNumber = EventTicket.generateTicketNumber()
      ticket.qrCode = EventTicket.generateQRCode()
      ticket.status = 'valid'

      await ticket.save()
      tickets.push(ticket)
    }

    logger.info(`✅ [SESSION] Created ${tickets.length} tickets for order ${order.id}`)

    // Send confirmation email (lazy load to avoid boot issues)
    try {
      const mail = await import('@adonisjs/mail/services/main')
      const OrderConfirmationEmail = (await import('#emails/order_confirmation_email')).default
      await mail.default.send(new OrderConfirmationEmail(order, tickets))
      logger.info(`✅ [SESSION] Confirmation email sent for order ${order.id}`)
    } catch (error) {
      logger.error('✅ [SESSION] Failed to send confirmation email', { 
        error: (error as Error).message,
        orderId: order.id,
      })
    }

    logger.info(`✅ [SESSION] Completed processing for order ${order.id}`)
  }

  /**
   * Handle payment_intent.payment_failed event
   */
  private async handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata?.orderId

    if (!orderId) {
      logger.error('Missing orderId in payment intent metadata')
      return
    }

    const order = await Order.find(parseInt(orderId))

    if (order) {
      order.status = 'failed'
      await order.save()
      logger.info(`Order ${order.id} marked as failed`)
    }
  }

  /**
   * Handle charge.refunded event
   */
  private async handleRefund(charge: Stripe.Charge) {
    // Find order by Stripe session ID
    const order = await Order.query().where('stripePaymentIntentId', charge.payment_intent as string).first()

    if (order) {
      order.status = 'refunded'
      await order.save()

      // Cancel all associated tickets
      await EventTicket.query().where('orderId', order.id).update({ status: 'cancelled' })

      logger.info(`Order ${order.id} marked as refunded and tickets cancelled`)
    }
  }

  /**
   * Get order details
   * GET /api/stripe/order/:id
   */
  async getOrder({ params, response }: HttpContext) {
    try {
      const order = await Order.query()
        .where('id', params.id)
        .preload('tickets')
        .first()

      if (!order) {
        return response.status(404).json({ error: 'Order not found' })
      }

      return response.json(order)
    } catch (error) {
      logger.error('Failed to fetch order:', error)
      return response.status(500).json({
        error: 'Failed to fetch order',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  /**
   * Get user's orders
   * GET /api/stripe/orders
   */
  async getUserOrders({ auth, response }: HttpContext) {
    try {
      if (!auth?.user?.id) {
        return response.status(401).json({ error: 'Unauthorized' })
      }

      const orders = await Order.query()
        .where('userId', auth.user.id)
        .preload('tickets')
        .orderBy('createdAt', 'desc')

      return response.json(orders)
    } catch (error) {
      logger.error('Failed to fetch user orders:', error)
      return response.status(500).json({
        error: 'Failed to fetch orders',
        message: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }
}
