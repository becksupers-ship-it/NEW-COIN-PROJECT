'use server'

import { randomUUID } from 'node:crypto'
import { and, desc, eq, or } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { mediaAssets } from '@/lib/db/schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
}

export async function getPublishedMedia() {
  return db.select().from(mediaAssets).where(and(eq(mediaAssets.published, true), or(eq(mediaAssets.placement, 'homepage'), eq(mediaAssets.placement, 'both')))).orderBy(desc(mediaAssets.createdAt))
}

export async function getMediaAssets() {
  await requireAdmin()
  return db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt))
}

export async function createMedia(input: { url: string; title: string; description: string; placement: string; published: boolean }) {
  await requireAdmin()
  if (!input.url || !input.title.trim() || !input.description.trim()) throw new Error('Image, title, and write-up are required.')
  if (!['homepage', 'stories', 'both'].includes(input.placement)) throw new Error('Choose where this media should appear.')
  const id = randomUUID()
  await db.insert(mediaAssets).values({ id, url: input.url, title: input.title.trim(), description: input.description.trim(), placement: input.placement, published: input.published, updatedAt: new Date() })
  revalidatePath('/')
  revalidatePath('/admin/media')
  return { ok: true, id }
}

export async function updateMedia(id: string, input: { url: string; title: string; description: string; placement: string; published: boolean }) {
  await requireAdmin()
  if (!id || !input.url || !input.title.trim() || !input.description.trim()) throw new Error('Image, title, and write-up are required.')
  if (!['homepage', 'stories', 'both'].includes(input.placement)) throw new Error('Choose where this media should appear.')
  await db.update(mediaAssets).set({ ...input, title: input.title.trim(), description: input.description.trim(), updatedAt: new Date() }).where(eq(mediaAssets.id, id))
  revalidatePath('/')
  revalidatePath('/admin/media')
  return { ok: true }
}

export async function deleteMedia(id: string) {
  await requireAdmin()
  await db.delete(mediaAssets).where(eq(mediaAssets.id, id))
  revalidatePath('/')
  revalidatePath('/admin/media')
  return { ok: true }
}
