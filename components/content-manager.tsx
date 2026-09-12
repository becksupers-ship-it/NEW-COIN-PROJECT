'use client'

import { useState } from 'react'
import { createPost, createStory } from '@/app/actions/content'

type Mode = 'stories' | 'news'

export function ContentManager({ mode }: { mode: Mode }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [published, setPublished] = useState(true)
  async function submit(formData: FormData) {
    setBusy(true); setMessage('')
    try {
      if (mode === 'stories') await createStory({ name: String(formData.get('name')), location: String(formData.get('location')), quote: String(formData.get('quote')), category: String(formData.get('category')), imageUrl: String(formData.get('imageUrl') || ''), videoUrl: String(formData.get('videoUrl') || ''), rating: Number(formData.get('rating') || 5), published })
      else await createPost({ title: String(formData.get('title')), slug: String(formData.get('slug')), type: String(formData.get('type')), excerpt: String(formData.get('excerpt')), content: String(formData.get('content')), imageUrl: String(formData.get('imageUrl') || ''), published })
      setMessage('Saved and published settings updated.'); (document.querySelector('form') as HTMLFormElement)?.reset()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save.') } finally { setBusy(false) }
  }
  return <form action={submit} className="mt-8 grid gap-4 rounded-[2rem] border border-[#d9e1d8] bg-white p-6 shadow-sm">
    {mode === 'stories' ? <><label className="grid gap-2 text-sm font-bold">Beneficiary name<input name="name" required className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Location<input name="location" required className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Program category<input name="category" required className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Quote<textarea name="quote" required rows={4} className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Image URL<input name="imageUrl" type="url" className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Video URL<input name="videoUrl" type="url" className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Star rating<input name="rating" type="number" min="1" max="5" defaultValue="5" className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label></> : <><label className="grid gap-2 text-sm font-bold">Title<input name="title" required className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">URL slug<input name="slug" required className="rounded-xl border border-[#cbd8cc] p-3 font-normal" placeholder="community-health-outreach" /></label><label className="grid gap-2 text-sm font-bold">Type<select name="type" className="rounded-xl border border-[#cbd8cc] bg-white p-3 font-normal"><option>news</option><option>event</option></select></label><label className="grid gap-2 text-sm font-bold">Excerpt<textarea name="excerpt" required rows={3} className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Full content<textarea name="content" required rows={7} className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label><label className="grid gap-2 text-sm font-bold">Featured image URL<input name="imageUrl" type="url" className="rounded-xl border border-[#cbd8cc] p-3 font-normal" /></label></>}
    <label className="flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} /> Publish on the public site immediately</label><button disabled={busy} className="rounded-full bg-[#c56b4b] px-5 py-3 font-bold text-white disabled:opacity-60">{busy ? 'Saving…' : mode === 'stories' ? 'Save story' : 'Save post'}</button>{message && <p className="text-sm text-[#4d7164]" role="status">{message}</p>}
  </form>
}
