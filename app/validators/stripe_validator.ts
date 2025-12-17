import vine from '@vinejs/vine'

export const createCheckoutValidator = vine.compile(
  vine.object({
    amount: vine.number().min(1),
    currency: vine.string().optional(),
    successUrl: vine.string().url(),
    cancelUrl: vine.string().url(),
    eventId: vine.string().minLength(1),
    eventTitle: vine.string().minLength(3).maxLength(255),
    eventDate: vine.string().optional(),
    eventVenue: vine.string().optional(),
    quantity: vine.number().min(1).max(100).optional(),
    customerEmail: vine.string().email().optional(),
  })
)

export const webhookValidator = vine.compile(
  vine.object({
    type: vine.string(),
    data: vine.any(),
  })
)
