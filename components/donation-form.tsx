'use client'

import { useRef, useState } from 'react'
import { PageIntro, SiteShell, fieldClass } from '@/components/site-shell'
import { submitDonation } from '@/app/actions/submissions'

const ubaDetails = { accountName: 'BONDED FRIENDS OUTREACH INITIATIVE', accountNumber: '1030842578' }

export default function DonationForm({ title, description }: { title: string; description: string }) {
  const receiptInput = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState({ donorName: '', email: '', phone: '', amount: '5000', frequency: 'one-time', reference: '' })
  const [receiptUrl, setReceiptUrl] = useState('')
  const [receiptName, setReceiptName] = useState('')
  const [status, setStatus] = useState('')
  const [uploading, setUploading] = useState(false)
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function uploadReceipt(file: File) {
    setStatus('')
    setUploading(true)
    try {
      const data = new FormData()
      data.append('type', 'donation-receipt')
      data.append('file', file)
      const response = await fetch('/api/upload', { method: 'POST', body: data })
      const result = await response.json()
      if (!response.ok || !result.url) throw new Error(result.error || 'Upload failed')
      setReceiptUrl(result.url)
      setReceiptName(file.name)
    } catch (error) {
      setReceiptUrl('')
      setReceiptName('')
      setStatus(error instanceof Error ? error.message : 'Could not upload receipt.')
    } finally {
      setUploading(false)
    }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!receiptUrl) { setStatus('Please upload your payment receipt before confirming.') ; return }
    setStatus('Sending…')
    try {
      await submitDonation({ ...form, amount: Number(form.amount), receiptUrl })
      setStatus('Thank you — your donation confirmation and receipt were received.')
      setForm({ donorName: '', email: '', phone: '', amount: '5000', frequency: 'one-time', reference: '' })
      setReceiptUrl('')
      setReceiptName('')
      if (receiptInput.current) receiptInput.current.value = ''
    } catch {
      setStatus('Please check your details and try again.')
    }
  }

  return <SiteShell><main><PageIntro eyebrow="Make a donation" title={title} text={description} /><section className="mx-auto grid max-w-3xl gap-6 px-5 pb-24 lg:px-8">
    <div className="rounded-[2rem] bg-[#e5b65c] p-7 text-[#17332d] sm:p-9"><p className="text-sm font-bold uppercase tracking-[0.18em]">UBA transfer details</p><dl className="mt-5 grid gap-4 sm:grid-cols-2"><div><dt className="text-sm opacity-75">Account name</dt><dd className="mt-1 font-bold">{ubaDetails.accountName}</dd></div><div><dt className="text-sm opacity-75">Account number</dt><dd className="mt-1 font-bold tracking-wide">{ubaDetails.accountNumber}</dd></div></dl></div>
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] bg-[#edf3eb] p-7 sm:p-9"><input required value={form.donorName} onChange={(event) => update('donorName', event.target.value)} className={fieldClass} placeholder="Full name" /><input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={fieldClass} placeholder="Email address" /><input required value={form.phone} onChange={(event) => update('phone', event.target.value)} className={fieldClass} placeholder="Phone number" /><input required type="number" min="1" value={form.amount} onChange={(event) => update('amount', event.target.value)} className={fieldClass} placeholder="Amount" /><select value={form.frequency} onChange={(event) => update('frequency', event.target.value)} className={fieldClass}><option value="one-time">One-time</option><option value="monthly">Monthly</option></select><input required value={form.reference} onChange={(event) => update('reference', event.target.value)} className={fieldClass} placeholder="Transfer reference / narration" />
      <div className="grid gap-2"><label htmlFor="receipt" className="text-sm font-bold text-[#17332d]">Payment receipt</label><input ref={receiptInput} id="receipt" required type="file" accept="image/*,.jpg,.jpeg,.heic,.heif,.avif,.dng,.png,.webp,application/pdf" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadReceipt(file) }} className="rounded-2xl border border-[#d6dfd7] bg-white p-4 text-sm" /><p className="text-sm text-[#64776e]">Upload a JPG, PNG, WebP, or PDF receipt up to 5MB.</p>{receiptName && <p className="text-sm font-semibold text-[#17332d]">Uploaded: {receiptName}</p>}</div>
      <button disabled={uploading || !receiptUrl} className="rounded-full bg-[#c56b4b] px-6 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{uploading ? 'Uploading receipt…' : 'Confirm donation'}</button>{status && <p role="status" className="text-sm font-semibold">{status}</p>}
    </form></section></main></SiteShell>
}
