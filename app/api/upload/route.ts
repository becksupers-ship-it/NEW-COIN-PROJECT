import { put } from '@vercel/blob'
import { NextResponse, type NextRequest } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function POST(request: NextRequest) { const session=await auth.api.getSession({headers:await headers()}); if(!session?.user) return NextResponse.json({error:'Unauthorized'},{status:401}); const form=await request.formData(); const file=form.get('file'); if(!(file instanceof File)) return NextResponse.json({error:'File required'},{status:400}); if(file.size>5*1024*1024 || !file.type.startsWith('image/')) return NextResponse.json({error:'Images must be under 5MB'},{status:400}); const blob=await put(`bonded-friends/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'-')}`,file,{access:'public'}); return NextResponse.json({url:blob.url}) }
