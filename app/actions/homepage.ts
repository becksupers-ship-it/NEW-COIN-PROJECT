'use server'

import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { homepageContent } from '@/lib/db/schema'
import { homepageDefaults } from '@/lib/homepage-content'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
}

function clean(value: string, fallback: string) {
  const result = value.trim().replace(/[<>]/g, '')
  return result || fallback
}

export async function saveHomepageContent(input: Record<string, string | number>) {
  await requireAdmin()
  const numeric = ['directProgrammes', 'fundraising', 'administration'] as const
  const values = { ...homepageDefaults, ...input }
  const total = numeric.reduce((sum, key) => sum + Number(values[key]), 0)
  if (numeric.some((key) => !Number.isInteger(Number(values[key])) || Number(values[key]) < 0) || total !== 100) throw new Error('Transparency allocations must be whole numbers totaling 100%.')
  const cleaned = Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === 'number' ? value : clean(String(value), String(homepageDefaults[key as keyof typeof homepageDefaults] ?? ''))])) as typeof homepageDefaults
  await db.insert(homepageContent).values({ ...cleaned, updatedAt: new Date() }).onConflictDoUpdate({ target: homepageContent.id, set: { ...cleaned, updatedAt: new Date() } })
  revalidatePath('/')
  revalidatePath('/admin')
  revalidatePath('/admin/homepage')
  return { ok: true }
}
