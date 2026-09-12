'use server'
import { db } from '@/lib/db'
import { donations, volunteers } from '@/lib/db/schema'
import nodemailer from 'nodemailer'
import { randomUUID } from 'crypto'

const destination = 'bondedfriendsoutreachinitiativ@gmail.com'
const smtpUser = process.env.GMAIL_SMTP_USER
const smtpPassword = process.env.GMAIL_SMTP_APP_PASSWORD
const transporter = smtpUser && smtpPassword ? nodemailer.createTransport({
  service: 'gmail',
  auth: { user: smtpUser, pass: smtpPassword },
}) : null
function clean(value: string) { return value.trim().replace(/[<>]/g, '') }
async function notify(subject: string, html: string, id: string) {
  if (!transporter || !smtpUser) return 'pending'
  try {
    await transporter.sendMail({
      from: `Bonded Friends Outreach <${smtpUser}>`,
      to: destination,
      subject,
      html,
      headers: { 'X-Notification-ID': `bonded-friends/${id}` },
    })
    return 'sent'
  } catch (error) {
    console.error('[v0] Gmail notification failed:', error instanceof Error ? error.message : error)
    return 'failed'
  }
}
export async function submitDonation(input: { donorName: string; email: string; amount: number; frequency: string; reference: string; receiptUrl: string; phone?: string }) { const donorName=clean(input.donorName), email=clean(input.email), reference=clean(input.reference), receiptUrl=clean(input.receiptUrl), phone=clean(input.phone ?? ''); if (!donorName || !email.includes('@') || !reference || !receiptUrl || !Number.isInteger(input.amount) || input.amount <= 0 || !['one-time','monthly'].includes(input.frequency)) throw new Error('Invalid donation details'); const id = randomUUID(); const status = await notify('New donation confirmation', `<h2>New donation confirmation</h2><p><strong>Donor:</strong> ${donorName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'Not provided'}</p><p><strong>Amount:</strong> ₦${input.amount.toLocaleString()}</p><p><strong>Frequency:</strong> ${input.frequency}</p><p><strong>Payment reference:</strong> ${reference}</p><p><strong>UBA account:</strong> BONDED FRIENDS OUTREACH INITIATIVE · 1030842578</p><p><strong>Receipt:</strong> <a href="${receiptUrl}">View uploaded payment receipt</a></p>`, id); await db.insert(donations).values({ id, donorName, email, amount: input.amount, frequency: input.frequency, reference, receiptUrl, phone, notificationStatus: status }); return { ok: true, id } }
export async function submitVolunteer(input: { firstName: string; lastName: string; email: string; phone: string; interest: string; skills: string }) { const firstName=clean(input.firstName), lastName=clean(input.lastName), email=clean(input.email), phone=clean(input.phone), interest=clean(input.interest), skills=clean(input.skills); if (!firstName || !lastName || !email.includes('@') || !phone || !interest || !skills) throw new Error('Invalid volunteer details'); const id = randomUUID(); const status = await notify('New volunteer application', `<h2>New volunteer application</h2><p><strong>Name:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Interest:</strong> ${interest}</p><p><strong>Skills and experience:</strong></p><p>${skills}</p>`, id); await db.insert(volunteers).values({ id, firstName, lastName, email, phone, interest, skills, notificationStatus: status }); return { ok: true, id } }
