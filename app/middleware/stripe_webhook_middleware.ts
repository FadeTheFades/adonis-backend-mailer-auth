import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import logger from '@adonisjs/core/services/logger'

/**
 * Middleware to capture raw body for Stripe webhook signature verification
 * This runs as a route middleware BEFORE bodyparser and stores the raw body
 */
export default class StripeWebhookMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Only intercept the Stripe webhook route; otherwise fall through quickly
    const url = ctx.request.url()
    if (!url.startsWith('/api/stripe/webhook')) {
      return next()
    }

    try {
      // Read the raw body from the request stream BEFORE bodyparser
      const chunks: Buffer[] = []
      
      await new Promise<void>((resolve, reject) => {
        ctx.request.request.on('data', (chunk: Buffer) => {
          chunks.push(chunk)
        })
        
        ctx.request.request.on('end', () => {
          resolve()
        })
        
        ctx.request.request.on('error', reject)
      })
      
      // Concatenate all chunks into a single buffer
      const buffer = Buffer.concat(chunks)
      const rawBody = buffer.toString('utf-8')
      
      logger.info(`🔔 Webhook raw body captured: ${rawBody.length} bytes`)
      
      // Store the raw body on the context for the controller
      ;(ctx as any).rawBodyForStripe = rawBody
      
      // Store the raw body on the context for the controller
      ;(ctx as any).rawBodyForStripe = rawBody
      
      // Pre-parse JSON and set on request.body so bodyparser can see it's already parsed
      try {
        const parsed = JSON.parse(rawBody)
        ;(ctx.request as any).body_ = parsed
        // Mark as parsed so bodyparser sees parsedBody is set
        ;(ctx.request as any).__raw_body_parsed = true
      } catch {
        ;(ctx.request as any).body_ = {}
        ;(ctx.request as any).__raw_body_parsed = true
      }
      
    } catch (err) {
      logger.error({ err }, 'Error capturing Stripe webhook raw body')
    }
    
    await next()
  }
}
