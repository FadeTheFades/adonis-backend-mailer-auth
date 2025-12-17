import env from '#start/env'

/**
 * Stripe configuration
 * https://stripe.com/docs/api
 */
const stripeConfig = {
  apiKey: env.get('STRIPE_SECRET_KEY'),
  publishableKey: env.get('STRIPE_PUBLISHABLE_KEY'),
  webhookSecret: env.get('STRIPE_WEBHOOK_SECRET'),
}

export default stripeConfig
