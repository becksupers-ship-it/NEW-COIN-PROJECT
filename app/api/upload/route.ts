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
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    const imageExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif']
    const isReceiptFile = isDonationReceipt && (file.type === 'application/pdf' || extension === 'pdf')
    const isImageFile = file.type.startsWith('image/') || imageExtensions.includes(extension)
    if (!isImageFile && !isReceiptFile) return NextResponse.json({ error: isDonationReceipt ? 'Choose a JPG, PNG, WebP, HEIC, HEIF, AVIF, or PDF receipt.' : 'Choose a JPG, PNG, WebP, HEIC, HEIF, or AVIF image.' }, { status: 400 })
    if (!isDonationReceipt && !isImageFile) return NextResponse.json({ error: 'Program pictures must be image files.' }, { status: 400 })
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: isDonationReceipt ? 'Receipts must be 10MB or smaller.' : 'Images must be 10MB or smaller.' }, { status: 400 })
    const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').slice(-120)
    const folder = uploadType === 'program-image' ? 'bonded-friends/programs' : uploadType === 'member-image' ? 'bonded-friends/members' : isDonationReceipt ? 'bonded-friends/donation-receipts' : 'bonded-friends'
    const blob = await put(`${folder}/${Date.now()}-${crypto.randomUUID()}-${filename}`, file, { access: 'public', addRandomSuffix: false })
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown upload error'
    console.error('[v0] Upload failed:', message)
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 })
  }
}
