import app from '@adonisjs/core/services/app'
import env from '#start/env'
import fs from 'fs'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

export default class AvatarService {
    public static async upload(user: any, avatar: MultipartFile) {
        const uploadDir = app.publicPath('uploads/avatars')
        fs.mkdirSync(uploadDir, { recursive: true })

        const fileName = `${user.id}_${Date.now()}.${avatar.extname}`

        if (user.avatar && user.avatar.startsWith('/uploads/')) {
            const oldAvatarPath = app.publicPath(user.avatar.replace(/^\/+/, ''))
            try {
                if (fs.existsSync(oldAvatarPath)) {
                    fs.unlinkSync(oldAvatarPath)
                }
            } catch (err) {
                console.warn(`⚠️ Failed to delete old avatar: ${err}`)
            }
        }

        await avatar.move(uploadDir, { name: fileName })

        user.avatar = `/uploads/avatars/${fileName}`
        await user.save()

        const baseUrl = env.get('APP_URL')
        const avatarUrl = `${baseUrl}${user.avatar}`

        return {
            status: true,
            message: 'Avatar uploaded successfully',
            avatar_url: avatarUrl,
        }
    }
}
