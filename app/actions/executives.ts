'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { executives } from '@/lib/db/schema'
import { requireAdmin } from '@/lib/auth'

type ExecutiveInput = { name: string; occupation: string; stateOfOrigin: string; currentState: string; impact: string; contribution: string; office: string; imageUrl?: string; published: boolean }
const clean = (value: string) => value.trim()
function validate(input: ExecutiveInput) {
  if ([input.name, input.occupation, input.stateOfOrigin, input.currentState, input.impact, input.contribution, input.office].some((value) => !value?.trim())) throw new Error('Complete every executive information field before saving.')
}
export async function getAdminExecutives() { await requireAdmin(); return db.select().from(executives).orderBy(desc(executives.createdAt)) }
export async function getPublishedExecutives() { return db.select().from(executives).where(eq(executives.published, true)).orderBy(desc(executives.createdAt)) }
export async function createExecutive(input: ExecutiveInput) { await requireAdmin(); validate(input); const id = randomUUID(); await db.insert(executives).values({ id, ...input, name: clean(input.name), occupation: clean(input.occupation), stateOfOrigin: clean(input.stateOfOrigin), currentState: clean(input.currentState), impact: clean(input.impact), contribution: clean(input.contribution), office: clean(input.office), imageUrl: input.imageUrl?.trim() || null }); revalidatePath('/admin/executives'); revalidatePath('/executives'); return { ok: true, id } }
export async function updateExecutive(id: string, input: ExecutiveInput) { await requireAdmin(); if (!id) throw new Error('Executive ID is required.'); validate(input); await db.update(executives).set({ ...input, name: clean(input.name), occupation: clean(input.occupation), stateOfOrigin: clean(input.stateOfOrigin), currentState: clean(input.currentState), impact: clean(input.impact), contribution: clean(input.contribution), office: clean(input.office), imageUrl: input.imageUrl?.trim() || null, updatedAt: new Date() }).where(eq(executives.id, id)); revalidatePath('/admin/executives'); revalidatePath('/executives'); return { ok: true } }
export async function deleteExecutive(id: string) { await requireAdmin(); await db.delete(executives).where(eq(executives.id, id)); revalidatePath('/admin/executives'); revalidatePath('/executives'); return { ok: true } }
