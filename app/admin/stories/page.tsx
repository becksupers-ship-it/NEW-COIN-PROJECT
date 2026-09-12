import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getAdminStories } from '@/app/actions/content'
import { ContentManager } from '@/components/content-manager'

export const dynamic = 'force-dynamic'
export default async function StoriesManager() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/admin/login'); const stories = await getAdminStories(); return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] lg:px-10"><div className="mx-auto max-w-6xl"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><ArrowLeft size={16}/> Dashboard</Link><h1 className="mt-10 text-4xl font-semibold">Impact stories</h1><p className="mt-2 text-sm text-[#64776e]">Create and publish beneficiary voices.</p><ContentManager mode="stories"/><div className="mt-8 grid gap-3">{stories.map((story) => <div key={story.id} className="flex items-center justify-between rounded-2xl bg-white p-5"><div><p className="font-bold">{story.name}</p><p className="text-sm text-[#64776e]">{story.category} · {story.published ? 'Published' : 'Draft'}</p></div></div>)}</div></div></main> }
