import type { HttpContext } from '@adonisjs/core/http'
import LandStewardshipPlan from '#models/land_stewardship_plan'
import vine from '@vinejs/vine'
import app from '@adonisjs/core/services/app'
import { cuid } from '@adonisjs/core/helpers'

export default class LandStewardshipPlansController {

    public async show({ auth, response }: HttpContext) {
        const user = auth.user!
        const plan = await LandStewardshipPlan.query()
            .where('userId', user.id)
            .where('status', 'draft')
            .first()

        if (!plan) return response.noContent()
        return response.ok(plan)
    }

    public async step1({ auth, request, response }: HttpContext) {
        const user = auth.user!

        const schema = vine.object({
            full_name: vine.string().trim(),
            phone_number: vine.string().trim(),
            email: vine.string().email(),
            is_returning_steward: vine.boolean()
        })
        const payload = await request.validateUsing(vine.compile(schema))

        const plan = await LandStewardshipPlan.updateOrCreate(
            { userId: user.id, status: 'draft' },
            {
                ...payload,
                currentStep: 1
            }
        )

        if (!plan.caseNumber) {
            plan.caseNumber = `TAS-${new Date().getFullYear()}-${plan.id.toString().padStart(4, '0')}`
            await plan.save()
        }

        return response.ok({ success: true, plan_id: plan.id, case_number: plan.caseNumber })
    }

    public async step2({ auth, request, response }: HttpContext) {
        const user = auth.user!

        const schema = vine.object({
            county: vine.string(),
            property_address: vine.string(),
            approximate_acreage: vine.number(),
            primary_current_land_use: vine.string(),
            land_management_goals: vine.array(vine.string()),
            other_goals_text: vine.string().optional()
        })
        const payload = await request.validateUsing(vine.compile(schema))

        const plan = await LandStewardshipPlan.findByOrFail('userId', user.id)

        await plan.merge({
            county: payload.county,
            propertyAddress: payload.property_address,
            approximateAcreage: payload.approximate_acreage,
            primaryCurrentLandUse: payload.primary_current_land_use,
            landManagementGoals: payload.land_management_goals,
            otherGoalsText: payload.other_goals_text || null,
            currentStep: Math.max(plan.currentStep, 2)
        }).save()

        return response.ok({ success: true })
    }

    public async step3({ auth, request, response }: HttpContext) {
        const user = auth.user!

        const textSchema = vine.object({
            gate_access_notes: vine.string().optional(),
            known_utilities: vine.string().optional(),
            hazards_awareness: vine.string().optional(),
            gps_pin_link: vine.string().optional(),
        })
        const payload = await request.validateUsing(vine.compile(textSchema))

        const plan = await LandStewardshipPlan.findByOrFail('userId', user.id)

        const photos = request.files('uploaded_photos', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg', 'webp']
        })

        let photoPaths: string[] = plan.uploadedPhotos || []

        for (const photo of photos) {
            if (photo.isValid) {
                await photo.move(app.makePath('uploads/plans/photos'), {
                    name: `${cuid()}.${photo.extname}`
                })
                photoPaths.push(photo.fileName!)
            }
        }

        const mapScreenshot = request.file('map_screenshot', {
            size: '10mb',
            extnames: ['jpg', 'png', 'jpeg', 'pdf']
        })

        let mapPath = plan.mapScreenshotPath
        if (mapScreenshot && mapScreenshot.isValid) {
            await mapScreenshot.move(app.makePath('uploads/plans/maps'), {
                name: `${cuid()}_map.${mapScreenshot.extname}`
            })
            mapPath = mapScreenshot.fileName!
        }

        await plan.merge({
            gateAccessNotes: payload.gate_access_notes,
            knownUtilities: payload.known_utilities,
            hazardsAwareness: payload.hazards_awareness,
            gpsPinLink: payload.gps_pin_link,
            uploadedPhotos: photoPaths,
            mapScreenshotPath: mapPath,
            currentStep: Math.max(plan.currentStep, 3)
        }).save()

        return response.ok({ success: true })
    }

    public async step4({ auth, request, response }: HttpContext) {
        const user = auth.user!

        const schema = vine.object({
            agrees_to_contact: vine.boolean(),
            subscribes_to_newsletter: vine.boolean(),
            agrees_to_sms: vine.boolean()
        })
        const payload = await request.validateUsing(vine.compile(schema))

        const plan = await LandStewardshipPlan.findByOrFail('userId', user.id)

        await plan.merge({
            agreesToContact: payload.agrees_to_contact,
            subscribesToNewsletter: payload.subscribes_to_newsletter,
            agreesToSms: payload.agrees_to_sms,
            currentStep: 4,
            status: 'submitted'
        }).save()

        return response.ok({
            success: true,
            message: 'Plan submitted successfully!',
            case_number: plan.caseNumber
        })
    }
}