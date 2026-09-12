'use client'

import { useState } from 'react'
import { PageIntro, SiteShell, fieldClass } from '@/components/site-shell'
import { submitDonation } from '@/app/actions/submissions'

const ubaDetails = {
  accountName: 'BONDED FRIENDS OUTREACH INITIATIVE',
  accountNumber: '1030842578',
}

export default function DonationForm({ title, description }: { title: string; description: string }) {
  const [form, setForm] = useState({ donorName: '', email: '', phone: '', amount: '5000', frequency: 'one-time', reference: '' })
  const [status, setStatus] = useState('')
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('Sending…')
    try {
      await submitDonation({ ...form, amount: Number(form.amount) })
      setStatus('Thank you — your donation confirmation was received.')
      setForm({ donorName: '', email: '', phone: '', amount: '5000', frequency: 'one-time', reference: '' })
    } catch {
      setStatus('Please check your details and try again.')
    }
  }

  return (
    <SiteShell>
      <main>
        <PageIntro eyebrow="Make a donation" title={title} text={description} />
        <section className="mx-auto grid max-w-3xl gap-6 px-5 pb-24 lg:px-8">
          <div className="rounded-[2rem] bg-[#e5b65c] p-7 text-[#17332d] sm:p-9">
            <p className="text-sm font-bold uppercase tracking-[0.18em]">UBA transfer details</p>
            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-sm opacity-75">Account name</dt><dd className="mt-1 font-bold">{ubaDetails.accountName}</dd></div>
              <div><dt className="text-sm opacity-75">Account number</dt><dd className="mt-1 font-bold tracking-wide">{ubaDetails.accountNumber}</dd></div>
            </dl>
            <div className="mt-6 grid gap-2 text-sm leading-6">
              <p><strong>Payment reference:</strong> Enter your full name followed by the campaign or purpose, for example: <span className="font-semibold">BackToSchool - Your Name</span> or <span className="font-semibold">GeneralDonation - Your Name</span>.</p>
              <p><strong>After payment:</strong> Save your transfer receipt and send the transaction reference, transfer date, and proof of payment through the organization&apos;s official notification channel.</p>
            </div>
          </div>
          <form onSubmit={submit} className="grid gap-4 rounded-[2rem] bg-[#edf3eb] p-7 sm:p-9">
            <input required value={form.donorName} onChange={(event) => update('donorName', event.target.value)} className={fieldClass} placeholder="Full name" />
            <input required type="email" value={form.email} onChange={(event) => update('email', event.target.value)} className={fieldClass} placeholder="Email address" />
            <input required value={form.phone} onChange={(event) => update('phone', event.target.value)} className={fieldClass} placeholder="Phone number" />
            <input required type="number" min="1" value={form.amount} onChange={(event) => update('amount', event.target.value)} className={fieldClass} placeholder="Amount" />
            <select value={form.frequency} onChange={(event) => update('frequency', event.target.value)} className={fieldClass}><option value="one-time">One-time</option><option value="monthly">Monthly</option></select>
            <input required value={form.reference} onChange={(event) => update('reference', event.target.value)} className={fieldClass} placeholder="Transfer reference / narration" />
            <button className="rounded-full bg-[#c56b4b] px-6 py-3 font-bold text-white">Confirm donation</button>
            {status && <p role="status" className="text-sm font-semibold">{status}</p>}
          </form>
        </section>
      </main>
    </SiteShell>
  )
}
