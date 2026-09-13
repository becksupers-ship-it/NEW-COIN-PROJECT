import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft, HeartHandshake, Users, ExternalLink, FileText } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getAdminDonations, getAdminVolunteers } from '@/app/actions/submissions'

export const dynamic = 'force-dynamic'

export default async function SubmissionsManager() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const [donations, volunteers] = await Promise.all([getAdminDonations(), getAdminVolunteers()])

  return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] lg:px-10">
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><ArrowLeft size={16} /> Dashboard</Link>
      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c56b4b]">Live submission records</p>
        <h1 className="mt-2 text-4xl font-semibold">Donations & volunteers</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#64776e]">Every successful public submission is saved to the database immediately and appears here for review, including the uploaded payment receipt.</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8"><HeartHandshake className="text-[#c56b4b]" /><p className="mt-8 text-4xl font-semibold">{donations.length}</p><p className="mt-2 font-semibold">Donation confirmations</p><p className="mt-1 text-sm text-[#789086]">Payment details and receipts received.</p></div>
        <div className="rounded-[2rem] bg-white p-8"><Users className="text-[#c56b4b]" /><p className="mt-8 text-4xl font-semibold">{volunteers.length}</p><p className="mt-2 font-semibold">Volunteer applications</p><p className="mt-1 text-sm text-[#789086]">Volunteer information received.</p></div>
      </div>
      <section className="mt-8 rounded-[2rem] bg-white p-5 sm:p-8"><div className="flex items-center gap-3"><HeartHandshake className="text-[#c56b4b]" /><h2 className="text-2xl font-semibold">Donation records</h2></div><div className="mt-6 grid gap-4">{donations.length === 0 ? <p className="rounded-2xl bg-[#f3f6f1] p-5 text-sm text-[#64776e]">No donation confirmations have been received yet.</p> : donations.map((donation) => <article key={donation.id} className="rounded-2xl border border-[#d9e1d8] p-5"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><h3 className="text-lg font-bold">{donation.donorName}</h3><p className="text-sm text-[#64776e]">{donation.email} · {donation.phone || 'No phone provided'}</p></div><p className="text-xl font-bold text-[#c56b4b]">₦{donation.amount.toLocaleString()}</p></div><div className="mt-4 grid gap-2 text-sm text-[#425b50] sm:grid-cols-2"><p><strong>Frequency:</strong> {donation.frequency}</p><p><strong>Reference:</strong> {donation.reference}</p><p><strong>Received:</strong> {donation.createdAt.toLocaleString()}</p><p><strong>Notification:</strong> {donation.notificationStatus}</p></div>{donation.receiptUrl && <a href={donation.receiptUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><FileText size={16} /> View payment receipt <ExternalLink size={14} /></a>}</article>)}</div></section>
      <section className="mt-8 rounded-[2rem] bg-white p-5 sm:p-8"><div className="flex items-center gap-3"><Users className="text-[#c56b4b]" /><h2 className="text-2xl font-semibold">Volunteer applications</h2></div><div className="mt-6 grid gap-4">{volunteers.length === 0 ? <p className="rounded-2xl bg-[#f3f6f1] p-5 text-sm text-[#64776e]">No volunteer applications have been received yet.</p> : volunteers.map((volunteer) => <article key={volunteer.id} className="rounded-2xl border border-[#d9e1d8] p-5"><h3 className="text-lg font-bold">{volunteer.firstName} {volunteer.lastName}</h3><p className="text-sm text-[#64776e]">{volunteer.email} · {volunteer.phone}</p><div className="mt-4 grid gap-2 text-sm text-[#425b50]"><p><strong>Interest:</strong> {volunteer.interest}</p><p><strong>Skills and experience:</strong> {volunteer.skills}</p><p><strong>Received:</strong> {volunteer.createdAt.toLocaleString()}</p><p><strong>Notification:</strong> {volunteer.notificationStatus}</p></div></article>)}</div></section>
    </div>
  </main>
}
