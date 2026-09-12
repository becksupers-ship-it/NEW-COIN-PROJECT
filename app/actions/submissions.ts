'use server'
import { db } from '@/lib/db'
import { donations, volunteers } from '@/lib/db/schema'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'

const destination = 'bondedfriendsoutreachinitiativ@gmail.com'
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
async function notify(subject: string, html: string, id: string) { if (!resend) return 'pending'; const result = await resend.emails.send({ from: 'Bonded Friends <onboarding@resend.dev>', to: [destination], subject, html }, { idempotencyKey: `bonded-friends/${id}` }); return result.error ? 'failed' : 'sent' }
export async function submitDonation(input: { donorName: string; email: string; amount: number; frequency: string; reference: string; phone?: string }) { const id = randomUUID(); const status = await notify('New donation confirmation', `<p>${input.donorName} submitted a ₦${input.amount.toLocaleString()} ${input.frequency} donation.</p><p>Reference: ${input.reference}</p>`, id); await db.insert(donations).values({ id, ...input, notificationStatus: status }); return { ok: true, id } }
export async function submitVolunteer(input: { firstName: string; lastName: string; email: string; phone: string; interest: string; skills: string }) { const id = randomUUID(); const status = await notify('New volunteer application', `<p>${input.firstName} ${input.lastName} applied to volunteer.</p><p>${input.email} · ${input.interest}</p>`, id); await db.insert(volunteers).values({ id, ...input, notificationStatus: status }); return { ok: true, id } }
