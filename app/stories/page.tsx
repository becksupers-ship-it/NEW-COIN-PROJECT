import { getPublishedStories } from '@/app/actions/content'
import { PageIntro, SiteShell } from '@/components/site-shell'

export const dynamic = 'force-dynamic'

export default async function StoriesPage() {
  const stories = await getPublishedStories()
  return <SiteShell><main><PageIntro eyebrow="Stories of impact" title="The people behind the numbers." text="Every number represents a person, a family, and a community with a story worth hearing."/><section className="mx-auto grid max-w-7xl gap-6 px-5 pb-24 lg:grid-cols-3 lg:px-8">{stories.map((story, index) => <article key={story.id} className={`flex min-h-96 flex-col rounded-[2rem] p-8 ${index % 2 ? 'bg-[#e5b65c]' : 'bg-[#17332d] text-[#f7f4eb]'}`}>{story.imageUrl && <img src={story.imageUrl} alt="" className="mb-5 h-40 w-full rounded-2xl object-cover"/>}<div className="text-[#e5b65c]">{'★'.repeat(story.rating)}</div><p className="mt-6 text-2xl font-medium leading-9">“{story.quote}”</p><div className="mt-auto pt-8"><p className="font-bold">{story.name}</p><p className="text-sm opacity-70">{story.location} · {story.category}</p></div></article>)}</section></main></SiteShell>
}
