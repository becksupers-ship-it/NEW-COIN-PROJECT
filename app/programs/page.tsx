import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PageIntro, SiteShell } from '@/components/site-shell'
import { db } from '@/lib/db'
import { programs } from '@/lib/db/schema'
import { desc, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function ProgramsPage() {
  const items = await db.select().from(programs).where(eq(programs.status, 'published')).orderBy(desc(programs.updatedAt))
  return <SiteShell><main><PageIntro eyebrow="Our programs" title="Practical care, built around real needs." text="We work with communities to turn urgent needs into steady pathways for dignity, opportunity, and belonging."/><section className="mx-auto grid max-w-7xl gap-5 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">{items.map((program, index) => <article key={program.id} className="group flex min-h-72 flex-col rounded-[2rem] border border-[#d9e1d8] bg-white p-7 transition hover:-translate-y-1 hover:border-[#c56b4b] dark:bg-[#1b332e]"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf3eb] text-[#c56b4b] text-sm font-bold">0{index + 1}</span><span className="text-xs font-bold uppercase tracking-widest text-[#789086]">Published</span></div>{program.imageUrl && <img src={program.imageUrl} alt={program.title} className="mb-6 h-44 w-full rounded-2xl object-cover" />}<p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#c56b4b]">{program.category}</p><h2 className="mt-2 text-2xl font-semibold">{program.title}</h2><p className="mt-3 text-sm leading-6 text-[#64776e]">{program.summary}</p><Link href={`/programs/${program.slug}`} className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-[#c56b4b]">Explore program <ArrowUpRight size={16}/></Link></article>)}{items.length === 0 && <p className="rounded-2xl border border-dashed border-[#b9c9bd] p-8 text-[#64776e] sm:col-span-2 lg:col-span-3">New programs will appear here after they are published from the admin manager.</p>}</section></main></SiteShell>
}
