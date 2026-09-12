import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft, HeartHandshake, Users } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getHomepageContent } from '@/app/actions/homepage'
import HomepageEditor from '@/components/homepage-editor'

export const dynamic = 'force-dynamic'

export default async function SubmissionsManager() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const content = await getHomepageContent()

  return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] lg:px-10">
    <div className="mx-auto max-w-6xl">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><ArrowLeft size={16} /> Dashboard</Link>
      <div className="mt-10">
        <p className="text-xs font-bold uppercase tracking-widest text-[#c56b4b]">Submissions & public copy</p>
        <h1 className="mt-2 text-4xl font-semibold">Donations & volunteers</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#64776e]">Edit the public donation and volunteer messaging here. Saved changes appear on the main site automatically.</p>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="rounded-[2rem] bg-white p-8"><HeartHandshake className="text-[#c56b4b]" /><p className="mt-8 text-4xl font-semibold">0</p><p className="mt-2 font-semibold">Donation confirmations</p><p className="mt-1 text-sm text-[#789086]">Submission review remains available as new records arrive.</p></div>
        <div className="rounded-[2rem] bg-white p-8"><Users className="text-[#c56b4b]" /><p className="mt-8 text-4xl font-semibold">0</p><p className="mt-2 font-semibold">Volunteer applications</p><p className="mt-1 text-sm text-[#789086]">Submission review remains available as new records arrive.</p></div>
      </div>
      <section className="mt-8 rounded-[2rem] bg-white p-5 sm:p-8"><h2 className="mb-6 text-2xl font-semibold">Edit public donation and volunteer content</h2><HomepageEditor initial={content} /></section>
    </div>
  </main>
}
