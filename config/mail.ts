import env from '#start/env'
import { defineConfig } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: (env.get('MAIL_DRIVER') || 'memory') as any,

  mailers: {
    memory: {
      driver: 'memory'
    } as any,
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}