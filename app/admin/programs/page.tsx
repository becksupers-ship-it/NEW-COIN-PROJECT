import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { programs } from '@/lib/db/schema'
import { desc } from 'drizzle-orm'
import { AdminProgramManager } from '@/components/admin-program-manager'

export const dynamic = 'force-dynamic'

export default async function ProgramsManager() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const items = await db.select({ id: programs.id, title: programs.title, category: programs.category, summary: programs.summary, description: programs.description, imageUrl: programs.imageUrl, status: programs.status }).from(programs).orderBy(desc(programs.updatedAt))

  return <main className="min-h-screen bg-[#f3f6f1] px-5 py-8 text-[#17332d] lg:px-10"><div className="mx-auto max-w-7xl"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><ArrowLeft size={16} /> Dashboard</Link><div className="mt-10"><p className="text-xs font-bold uppercase tracking-widest text-[#c56b4b]">Program manager</p><h1 className="mt-2 text-4xl font-semibold">Your programs</h1><p className="mt-2 text-sm text-[#64776e]">Create, edit, publish, and archive outreach programs.</p></div><div className="mt-8"><AdminProgramManager initialPrograms={items} /></div></div></main>
}
