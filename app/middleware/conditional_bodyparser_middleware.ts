import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Wrapper around bodyparser that skips if request already parsed
 * Used for Stripe webhook which needs raw body for signature verification
 */
export default class ConditionalBodyparserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Skip bodyparser if already parsed (e.g., by Stripe webhook middleware)
    if ((ctx.request as any).__raw_body_parsed) {
      return next()
    }
    
    // Otherwise, import and run the standard bodyparser
    const bodyParserModule = await import('@adonisjs/core/bodyparser_middleware')
    const BodyParserMiddleware = bodyParserModule.default
    const config = await import('#config/bodyparser')
    const parser = new BodyParserMiddleware(config.default)
    return parser.handle(ctx, next)
  }
}
