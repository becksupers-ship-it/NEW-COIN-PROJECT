'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { eq, desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { verifiedMembers } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/auth'

const clean = (value: string) => value.trim()

type MemberInput = {
  name: string
  occupation: string
  stateOfOrigin: string
  currentState: string
  impact: string
  contribution: string
  office: string
  imageUrl?: string
  published: boolean
}

function validate(input: MemberInput) {
  const required = [input.name, input.occupation, input.stateOfOrigin, input.currentState, input.impact, input.contribution, input.office]
  if (required.some((value) => !value?.trim())) throw new Error('Complete every member information field before saving.')
}

export async function getAdminMembers() {
  await requireAdmin()
  return db.select().from(verifiedMembers).orderBy(desc(verifiedMembers.createdAt))
}

export async function createMember(input: MemberInput) {
  await requireAdmin()
  validate(input)
  const id = randomUUID()
  await db.insert(verifiedMembers).values({ id, name: clean(input.name), occupation: clean(input.occupation), stateOfOrigin: clean(input.stateOfOrigin), currentState: clean(input.currentState), impact: clean(input.impact), contribution: clean(input.contribution), office: clean(input.office), imageUrl: input.imageUrl?.trim() || null, published: input.published })
  revalidatePath('/admin/members')
  revalidatePath('/verified-members')
  return { ok: true, id }
}

export async function updateMember(id: string, input: MemberInput) {
  await requireAdmin()
  if (!id) throw new Error('Member ID is required.')
  validate(input)
  await db.update(verifiedMembers).set({ name: clean(input.name), occupation: clean(input.occupation), stateOfOrigin: clean(input.stateOfOrigin), currentState: clean(input.currentState), impact: clean(input.impact), contribution: clean(input.contribution), office: clean(input.office), imageUrl: input.imageUrl?.trim() || null, published: input.published, updatedAt: new Date() }).where(eq(verifiedMembers.id, id))
  revalidatePath('/admin/members')
  revalidatePath('/verified-members')
  return { ok: true }
}

export async function deleteMember(id: string) {
  await requireAdmin()
  await db.delete(verifiedMembers).where(eq(verifiedMembers.id, id))
  revalidatePath('/admin/members')
  revalidatePath('/verified-members')
  return { ok: true }
}

export async function getPublishedMembers() {
  return db.select().from(verifiedMembers).where(eq(verifiedMembers.published, true)).orderBy(desc(verifiedMembers.createdAt))
}
