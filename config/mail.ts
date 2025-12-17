import env from '#start/env'
import { defineConfig } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: env.get('MAIL_DRIVER') || 'memory',
  mailers: {
    memory: {
      driver: 'memory',
    },
  },
})

export default mailConfig
