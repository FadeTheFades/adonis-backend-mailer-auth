import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class LandStewardshipPlan extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number | null

  @column()
  declare editToken: string | null

  @column()
  declare fullName: string

  @column()
  declare phoneNumber: string

  @column()
  declare email: string

  @column()
  declare isReturningSteward: boolean

  @column()
  declare county: string | null

  @column()
  declare propertyAddress: string | null

  @column()
  declare approximateAcreage: number | null

  @column()
  declare primaryCurrentLandUse: string | null

  @column({
    prepare: (value: string[]) => JSON.stringify(value || []),
    consume: (value: any) => typeof value === 'string' ? JSON.parse(value) : (value || [])
  })
  declare landManagementGoals: string[]

  @column()
  declare otherGoalsText: string | null

  @column()
  declare gateAccessNotes: string | null

  @column()
  declare knownUtilities: string | null
  @column()
  declare hazardsAwareness: string | null

  @column()
  declare gpsPinLink: string | null

  @column({
    prepare: (value: any[]) => JSON.stringify(value || []),
    consume: (value: any) => typeof value === 'string' ? JSON.parse(value) : (value || [])
  })
  declare uploadedPhotos: string[]

  @column()
  declare mapScreenshotPath: string | null

  @column()
  declare agreesToContact: boolean

  @column()
  declare subscribesToNewsletter: boolean

  @column()
  declare agreesToSms: boolean

  @column()
  declare currentStep: number

  @column()
  declare caseNumber: string | null

  @column()
  declare status: 'draft' | 'submitted' | 'reviewed'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}