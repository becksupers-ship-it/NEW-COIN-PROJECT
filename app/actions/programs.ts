'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { programs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'

const clean = (value: string) => value.trim().replace(/[<>]/g, '')

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

function normalize(input: { title: string; category: string; summary: string; description: string; imageUrl?: string }) {
  const title = clean(input.title)
  const category = clean(input.category)
  const summary = clean(input.summary)
  const description = clean(input.description)
  const imageUrl = input.imageUrl ? clean(input.imageUrl) : undefined
  if (!title || !category || !summary || !description) throw new Error('Complete all required program fields')
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  return { title, category, summary, description, imageUrl, slug }
}

export async function getPublishedPrograms() {
  return db.select().from(programs).where(eq(programs.status, 'published'))
}

export async function createProgram(input: { title: string; category: string; summary: string; description: string; imageUrl?: string }) {
  await requireAdmin()
  const values = normalize(input)
  await db.insert(programs).values({ id: randomUUID(), ...values, status: 'draft', active: false })
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
}

export async function updateProgram(id: string, input: { title: string; category: string; summary: string; description: string; imageUrl?: string }) {
  await requireAdmin()
  const values = normalize(input)
  await db.update(programs).set({ ...values, updatedAt: new Date() }).where(eq(programs.id, id))
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
}

export async function updateProgramStatus(id: string, status: 'draft' | 'published' | 'archived') {
  await requireAdmin()
  await db.update(programs).set({ status, active: status === 'published', updatedAt: new Date() }).where(eq(programs.id, id))
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
}

export async function deleteProgram(id: string) {
  await requireAdmin()
  await db.delete(programs).where(eq(programs.id, id))
  revalidatePath('/admin/programs')
  revalidatePath('/programs')
  revalidatePath('/')
}
