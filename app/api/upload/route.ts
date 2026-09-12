import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const uploadType = form.get('type')
    const session = await auth.api.getSession({ headers: await headers() })
    const isDonationReceipt = uploadType === 'donation-receipt'
    if (!isDonationReceipt && !session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const file = form.get('file')
    if (!(file instanceof File)) return NextResponse.json({ error: isDonationReceipt ? 'Choose a payment receipt to upload.' : 'Choose an image to upload.' }, { status: 400 })
    const allowedTypes = isDonationReceipt ? ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] : ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) return NextResponse.json({ error: isDonationReceipt ? 'Only JPG, PNG, WebP, or PDF receipts are supported.' : 'Only JPG, PNG, and WebP images are supported.' }, { status: 400 })
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: isDonationReceipt ? 'Receipts must be 5MB or smaller.' : 'Images must be 5MB or smaller.' }, { status: 400 })
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)
    const folder = uploadType === 'program-image' ? 'bonded-friends/programs' : isDonationReceipt ? 'bonded-friends/donation-receipts' : 'bonded-friends'
    const blob = await put(`${folder}/${Date.now()}-${filename}`, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error('[v0] Upload failed', error)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
