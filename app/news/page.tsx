import { getPublishedPosts } from '@/app/actions/content'
import { PageIntro, SiteShell } from '@/components/site-shell'

export const dynamic = 'force-dynamic'

export default async function NewsPage() {
  const posts = await getPublishedPosts()
  return <SiteShell><main><PageIntro eyebrow="News & events" title="What’s happening in our circle." text="Updates, announcements, and reflections from the Bonded Friends community."/><section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 md:grid-cols-3 lg:px-8">{posts.map((post) => <article key={post.id} className="flex min-h-80 flex-col rounded-[2rem] border border-[#d9e1d8] bg-white p-7">{post.imageUrl && <img src={post.imageUrl} alt="" className="mb-5 h-36 w-full rounded-2xl object-cover"/>}<p className="text-xs font-bold uppercase tracking-widest text-[#c56b4b]">{post.type}</p><h2 className="mt-4 text-2xl font-semibold">{post.title}</h2><p className="mt-3 text-sm leading-6 text-[#64776e]">{post.excerpt}</p><p className="mt-auto pt-7 text-sm font-bold text-[#c56b4b]">{new Intl.DateTimeFormat('en-NG', { dateStyle: 'long' }).format(post.publishedAt)}</p></article>)}</section></main></SiteShell>
}
