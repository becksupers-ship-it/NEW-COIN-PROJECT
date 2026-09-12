import { get } from '@vercel/blob'
import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get('pathname')
  if (!pathname) return NextResponse.json({ error: 'Missing pathname' }, { status: 400 })
  const isReceipt = pathname.startsWith('bonded-friends/donation-receipts/')
  if (isReceipt) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await get(pathname, { access: 'private', ifNoneMatch: request.headers.get('if-none-match') ?? undefined })
    if (!result) return new NextResponse('Not found', { status: 404 })
    if (result.statusCode === 304) return new NextResponse(null, { status: 304, headers: { ETag: result.blob.etag, 'Cache-Control': 'private, no-cache' } })
    return new NextResponse(result.stream, { headers: { 'Content-Type': result.blob.contentType, ETag: result.blob.etag, 'Cache-Control': isReceipt ? 'private, no-cache' : 'public, max-age=31536000, immutable' } })
  } catch {
    return NextResponse.json({ error: 'Unable to load file' }, { status: 500 })
  }
}
