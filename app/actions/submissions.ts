'use server'
import { db } from '@/lib/db'
import { donations, volunteers } from '@/lib/db/schema'
import { getToken } from '@vercel/connect'
import { randomUUID } from 'crypto'

const telegramConnector = 'api.telegram.org/bonded-friends-alerts-new-bot'
const telegramChatId = process.env.TELEGRAM_CHAT_ID
function clean(value: string) { return value.trim().replace(/[<>]/g, '') }
function htmlToTelegramText(html: string) { return html.replace(/<br\s*\/?>(\n)?/gi, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim() }
async function notify(subject: string, html: string, id: string) {
  if (!telegramChatId) return 'pending'
  try {
    const botToken = await getToken(telegramConnector, { subject: { type: 'app' } })
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: telegramChatId, text: `${subject}\n\n${htmlToTelegramText(html)}\n\nNotification ID: ${id}` }) })
    if (!response.ok) throw new Error(`Telegram returned ${response.status}`)
    return 'sent'
  } catch (error) {
    console.error('[v0] Telegram notification failed:', error instanceof Error ? error.message : error)
    return 'failed'
  }
}
export async function submitDonation(input: { donorName: string; email: string; amount: number; frequency: string; reference: string; receiptUrl: string; phone?: string }) { const donorName=clean(input.donorName), email=clean(input.email), reference=clean(input.reference), receiptUrl=clean(input.receiptUrl), phone=clean(input.phone ?? ''); if (!donorName || !email.includes('@') || !reference || !receiptUrl || !Number.isInteger(input.amount) || input.amount <= 0 || !['one-time','monthly'].includes(input.frequency)) throw new Error('Invalid donation details'); const id = randomUUID(); const status = await notify('New donation confirmation', `<h2>New donation confirmation</h2><p><strong>Donor:</strong> ${donorName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'Not provided'}</p><p><strong>Amount:</strong> ₦${input.amount.toLocaleString()}</p><p><strong>Frequency:</strong> ${input.frequency}</p><p><strong>Payment reference:</strong> ${reference}</p><p><strong>UBA account:</strong> BONDED FRIENDS OUTREACH INITIATIVE · 1030842578</p><p><strong>Receipt:</strong> <a href="${receiptUrl}">View uploaded payment receipt</a></p>`, id); await db.insert(donations).values({ id, donorName, email, amount: input.amount, frequency: input.frequency, reference, receiptUrl, phone, notificationStatus: status }); return { ok: true, id } }
export async function submitVolunteer(input: { firstName: string; lastName: string; email: string; phone: string; interest: string; skills: string }) { const firstName=clean(input.firstName), lastName=clean(input.lastName), email=clean(input.email), phone=clean(input.phone), interest=clean(input.interest), skills=clean(input.skills); if (!firstName || !lastName || !email.includes('@') || !phone || !interest || !skills) throw new Error('Invalid volunteer details'); const id = randomUUID(); const status = await notify('New volunteer application', `<h2>New volunteer application</h2><p><strong>Name:</strong> ${firstName} ${lastName}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Interest:</strong> ${interest}</p><p><strong>Skills and experience:</strong></p><p>${skills}</p>`, id); await db.insert(volunteers).values({ id, firstName, lastName, email, phone, interest, skills, notificationStatus: status }); return { ok: true, id } }
