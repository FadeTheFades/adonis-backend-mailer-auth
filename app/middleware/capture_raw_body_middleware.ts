import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import getRawBody from 'raw-body'

/**
 * Middleware to capture raw body for webhook signature verification.
 * Only applies to webhook routes - skips for other routes.
 */
export default class CaptureRawBodyMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    // Only capture for webhook endpoints
    if (!request.url().includes('/api/stripe/webhook')) {
      return await next()
    }

    try {
      // Capture raw body before any parsing
      const rawBody = await getRawBody(request.request, '1mb')
      ;(request as any).rawBody = rawBody
    } catch (error) {
      return response.status(400).json({ error: 'Invalid request body' })
    }

    await next()
  }
}
