import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'
import { getHomepageContent } from '@/app/actions/homepage'
import { getPublishedPosts, getPublishedStories } from '@/app/actions/content'
import { getPublishedMedia } from '@/app/actions/media'
import { SiteShell } from '@/components/site-shell'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [content, stories, posts, media] = await Promise.all([getHomepageContent(), getPublishedStories(), getPublishedPosts(), getPublishedMedia()])
  const metrics = [[content.widowsValue, content.widowsLabel], [content.childrenValue, content.childrenLabel], [content.elderlyValue, content.elderlyLabel], [content.communitiesValue, content.communitiesLabel]]
  let values: { title: string; text: string }[] = []
  try {
    const parsed = JSON.parse(content.valuesJson || '[]')
    values = Array.isArray(parsed) ? parsed.filter((value): value is { title: string; text: string } => Boolean(value && typeof value.title === 'string' && typeof value.text === 'string')) : []
  } catch {
    values = []
  }
  return <SiteShell><main>
    <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-8 lg:pt-20"><div><div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eaf0e7] px-4 py-2 text-xs font-bold uppercase tracking-[.18em] text-[#4d7164]"><Sparkles size={14}/>{content.heroBadge}</div><h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-.04em] sm:text-6xl lg:text-7xl">{content.heroTitle}</h1><p className="mt-7 max-w-xl text-lg leading-8 text-[#5f716a]">{content.heroDescription}</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/donate" className="inline-flex items-center gap-2 rounded-full bg-[#c56b4b] px-6 py-4 text-sm font-bold text-white">{content.primaryCtaLabel}<ArrowRight size={16}/></Link><Link href="/programs" className="rounded-full border border-[#b9c9bd] px-6 py-4 text-sm font-bold">{content.secondaryCtaLabel}</Link></div></div><div className="rounded-[2.5rem] bg-[#17332d] p-8 text-[#f7f4eb]"><p className="text-sm uppercase tracking-[.18em] text-[#e5b65c]">{content.reachLabel}</p><p className="mt-4 text-7xl font-semibold text-[#e5b65c]">{content.reachValue}</p><div className="mt-8 grid grid-cols-2 gap-4">{metrics.map(([value, label]) => <div key={label} className="rounded-2xl border border-[#416256] p-4"><p className="text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-[#b9c9bd]">{label}</p></div>)}</div></div></section>
    <section className="bg-[#eaf0e7] px-5 py-20 lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c56b4b]">Our values</p><div className="mt-8 grid gap-5 md:grid-cols-4">{values.map((value) => <article key={value.title} className="rounded-3xl bg-white p-6"><h2 className="text-xl font-semibold">{value.title}</h2><p className="mt-3 text-sm leading-6 text-[#64776e]">{value.text}</p></article>)}</div></div></section>
    {media.length > 0 && <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c56b4b]">From the field</p><h2 className="mt-3 text-4xl font-semibold">Care in action</h2></div><Link href="/stories" className="text-sm font-bold text-[#c56b4b]">View all stories</Link></div><div className="mt-8 grid gap-6 md:grid-cols-3">{media.slice(0, 6).map((item) => <article key={item.id} className="overflow-hidden rounded-3xl bg-[#f3f6f1]"><img src={item.url} alt={item.title} className="aspect-[4/3] w-full object-cover" /><div className="p-6"><h3 className="text-xl font-semibold">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#64776e]">{item.description}</p></div></article>)}</div></section>}
    {stories.length > 0 && <section className="bg-[#17332d] px-5 py-20 text-[#f7f4eb] lg:px-8"><div className="mx-auto max-w-7xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#e5b65c]">Stories of impact</p><div className="mt-8 grid gap-6 md:grid-cols-3">{stories.slice(0, 3).map((story) => <article key={story.id} className="rounded-3xl border border-[#416256] p-6"><p className="text-lg leading-8">“{story.quote}”</p><p className="mt-6 text-sm font-bold text-[#e5b65c]">{story.name} · {story.location}</p></article>)}</div></div></section>}
    {posts.length > 0 && <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#c56b4b]">Latest updates</p><div className="mt-8 grid gap-6 md:grid-cols-3">{posts.slice(0, 3).map((post) => <article key={post.id} className="rounded-3xl border border-[#d6dfd7] p-6"><p className="text-xs font-bold uppercase tracking-wider text-[#64776e]">{post.type}</p><h2 className="mt-3 text-2xl font-semibold">{post.title}</h2><p className="mt-3 text-sm leading-6 text-[#64776e]">{post.excerpt}</p></article>)}</div></section>}
  </main></SiteShell>
}
