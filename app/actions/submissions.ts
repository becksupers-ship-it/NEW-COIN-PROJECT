'use server'
import { db } from '@/lib/db'
import { donations, volunteers } from '@/lib/db/schema'
import { Resend } from 'resend'
import { randomUUID } from 'crypto'

const destination = 'bondedfriendsoutreachinitiativ@gmail.com'
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null
function clean(value: string) { return value.trim().replace(/[<>]/g, '') }
async function notify(subject: string, html: string, id: string) { if (!resend) return 'pending'; const result = await resend.emails.send({ from: 'Bonded Friends <onboarding@resend.dev>', to: [destination], subject, html }, { idempotencyKey: `bonded-friends/${id}` }); return result.error ? 'failed' : 'sent' }
export async function submitDonation(input: { donorName: string; email: string; amount: number; frequency: string; reference: string; phone?: string }) { const donorName=clean(input.donorName), email=clean(input.email), reference=clean(input.reference), phone=clean(input.phone ?? ''); if (!donorName || !email.includes('@') || !reference || !Number.isInteger(input.amount) || input.amount <= 0 || !['one-time','monthly'].includes(input.frequency)) throw new Error('Invalid donation details'); const id = randomUUID(); const status = await notify('New donation confirmation', `<p>${donorName} submitted a ₦${input.amount.toLocaleString()} ${input.frequency} donation.</p><p>Reference: ${reference}</p>`, id); await db.insert(donations).values({ id, donorName, email, amount: input.amount, frequency: input.frequency, reference, phone, notificationStatus: status }); return { ok: true, id } }
export async function submitVolunteer(input: { firstName: string; lastName: string; email: string; phone: string; interest: string; skills: string }) { const firstName=clean(input.firstName), lastName=clean(input.lastName), email=clean(input.email), phone=clean(input.phone), interest=clean(input.interest), skills=clean(input.skills); if (!firstName || !lastName || !email.includes('@') || !phone || !interest || !skills) throw new Error('Invalid volunteer details'); const id = randomUUID(); const status = await notify('New volunteer application', `<p>${firstName} ${lastName} applied to volunteer.</p><p>${email} · ${interest}</p>`, id); await db.insert(volunteers).values({ id, firstName, lastName, email, phone, interest, skills, notificationStatus: status }); return { ok: true, id } }
