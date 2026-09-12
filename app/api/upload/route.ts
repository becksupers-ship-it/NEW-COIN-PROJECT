import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const uploadType = form.get('type')
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: 'Choose an image to upload.' }, { status: 400 })
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return NextResponse.json({ error: 'Only JPG, PNG, and WebP images are supported.' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'Images must be 5MB or smaller.' }, { status: 400 })
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)
    const folder = uploadType === 'program-image' ? 'bonded-friends/programs' : uploadType === 'donation-receipt' ? 'bonded-friends/donation-receipts' : 'bonded-friends'
    const blob = await put(`${folder}/${Date.now()}-${filename}`, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Upload failed', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
