import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

/**
 * Marks request as already parsed so bodyparser skips it
 * Used for Stripe webhook which handles raw body separately
 */
export default class SkipBodyparserMiddleware {
  async handle(ctx: HttpContext, next: NextFn) {
    // Mark as already parsed so conditional bodyparser will skip
    ;(ctx.request as any).__raw_body_parsed = true
    ;(ctx.request as any).body_ = {}
    return next()
  }
}
