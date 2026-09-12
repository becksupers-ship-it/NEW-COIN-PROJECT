'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { homepageContent } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

const defaultContent = { id: 'homepage', heroBadge: 'Rooted in care', heroTitle: 'Together, we make hope practical.', heroDescription: 'Bonded Friends Outreach Initiative walks alongside widows, children, older people, and communities across Nigeria with care that restores dignity and opens doors.', primaryCtaLabel: 'Make an impact', secondaryCtaLabel: 'Explore our work', reachValue: '2,480+', reachLabel: 'people reached this year', widowsValue: '2,480', widowsLabel: 'Widows reached', childrenValue: '6,200', childrenLabel: 'Children supported', elderlyValue: '1,150', elderlyLabel: 'Elderly assisted', communitiesValue: '38', communitiesLabel: 'Communities reached', valuesJson: JSON.stringify([{ title: 'Compassion', text: 'We lead with empathy, dignity, and a deep respect for every person we serve.' }, { title: 'Integrity', text: 'We steward every gift responsibly and keep our work open, accountable, and measurable.' }, { title: 'Empowerment', text: 'We create pathways for people to build brighter, more independent futures.' }, { title: 'Collaboration', text: 'We partner with communities and changemakers to make lasting progress together.' }]), directProgrammesPercent: 75, fundraisingPercent: 15, administrationPercent: 10, transparencyNote: 'Audited financial statements are available upon request.', donationTitle: 'Give hope a place to grow.', donationDescription: 'Your gift helps provide school supplies, food, healthcare, and livelihood support where it is needed most.', volunteerTitle: 'Bring your gifts into the circle.', volunteerDescription: 'Whether you have an hour, a skill, or a heart for people, there is a place for you here.', volunteerNote: 'We welcome people at every stage of life. Our team will contact you to understand where you can contribute best.' }

export async function getHomepageContent() { const rows = await db.select().from(homepageContent).where(eq(homepageContent.id, 'homepage')).limit(1); return rows[0] ?? defaultContent }

async function requireAdmin() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) throw new Error('Unauthorized'); return session.user }

export async function saveHomepageContent(input: Record<string, unknown>) { await requireAdmin(); const values = { ...defaultContent, ...input } as Record<string, unknown>; const percentages = [Number(values.directProgrammesPercent), Number(values.fundraisingPercent), Number(values.administrationPercent)]; if (percentages.some((value) => !Number.isInteger(value) || value < 0) || percentages.reduce((sum, value) => sum + value, 0) !== 100) throw new Error('Transparency percentages must be whole numbers totaling 100.'); const textFields = ['heroBadge','heroTitle','heroDescription','primaryCtaLabel','secondaryCtaLabel','reachValue','reachLabel','widowsValue','widowsLabel','childrenValue','childrenLabel','elderlyValue','elderlyLabel','communitiesValue','communitiesLabel','transparencyNote','donationTitle','donationDescription','volunteerTitle','volunteerDescription','volunteerNote']; for (const field of textFields) if (!String(values[field] ?? '').trim()) throw new Error(`${field} cannot be empty.`); let valuesJson = typeof values.valuesJson === 'string' ? values.valuesJson : JSON.stringify(values.valuesJson)
  try {
    const parsed = JSON.parse(valuesJson)
    if (!Array.isArray(parsed)) throw new Error()
    valuesJson = JSON.stringify(parsed.map((value) => ({ title: String(value?.title ?? '').trim(), text: String(value?.text ?? '').trim() })).filter((value) => value.title && value.text))
  } catch {
    throw new Error('Core values must be valid JSON with title and text fields.')
  }
  const record = { ...values, id: 'homepage', directProgrammesPercent: percentages[0], fundraisingPercent: percentages[1], administrationPercent: percentages[2], valuesJson }; await db.insert(homepageContent).values(record as typeof homepageContent.$inferInsert).onConflictDoUpdate({ target: homepageContent.id, set: { ...record, id: undefined, updatedAt: new Date() } }); revalidatePath('/'); revalidatePath('/admin/homepage'); return { ok: true } }
