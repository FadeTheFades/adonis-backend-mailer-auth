export const ContactMethods = ['email', 'phone', 'mail'] as const

export type ContactMethod = (typeof ContactMethods)[number]