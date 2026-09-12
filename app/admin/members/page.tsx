import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getAdminMembers } from '@/app/actions/members'
import { MembersManager } from '@/components/members-manager'

export const dynamic = 'force-dynamic'

export default async function AdminMembersPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const members = await getAdminMembers()
  return <main className="min-h-screen bg-[#f3f6f1] px-5 py-8 text-[#17332d] lg:px-10 lg:py-12"><div className="mx-auto max-w-7xl"><a href="/admin" className="text-sm font-bold text-[#c56b4b]">← Dashboard</a><div className="mt-10"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c56b4b]">People directory</p><h1 className="mt-3 text-5xl font-semibold tracking-[-.05em]">Verified Members</h1><p className="mt-4 max-w-2xl text-lg leading-8 text-[#64776e]">Add the people serving Bonded Friends Outreach Initiative and publish their roles, stories, impact, and contributions.</p></div><div className="mt-10"><MembersManager initialMembers={members} /></div></div></main>
}
