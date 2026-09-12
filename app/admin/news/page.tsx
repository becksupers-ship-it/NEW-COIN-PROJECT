import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getAdminPosts } from '@/app/actions/content'
import { ContentManager } from '@/components/content-manager'

export const dynamic = 'force-dynamic'
export default async function NewsManager() { const session = await auth.api.getSession({ headers: await headers() }); if (!session?.user) redirect('/admin/login'); const posts = await getAdminPosts(); return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] lg:px-10"><div className="mx-auto max-w-6xl"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><ArrowLeft size={16}/> Dashboard</Link><h1 className="mt-10 text-4xl font-semibold">News & events</h1><p className="mt-2 text-sm text-[#64776e]">Create announcements and events for the public site.</p><ContentManager mode="news"/><div className="mt-8 grid gap-3">{posts.map((post) => <div key={post.id} className="rounded-2xl bg-white p-5"><p className="font-bold">{post.title}</p><p className="text-sm text-[#64776e]">{post.type} · {post.published ? 'Published' : 'Draft'}</p></div>)}</div></div></main> }
