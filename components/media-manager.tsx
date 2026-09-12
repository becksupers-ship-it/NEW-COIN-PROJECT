'use client'

import { useState } from 'react'
import { createMedia, deleteMedia, updateMedia } from '@/app/actions/media'

type Asset = { id: string; url: string; title: string; description: string; placement: string; published: boolean }
const blank = { url: '', title: '', description: '', placement: 'homepage', published: true }

export function MediaManager({ initialAssets }: { initialAssets: Asset[] }) {
  const [assets, setAssets] = useState(initialAssets)
  const [form, setForm] = useState(blank)
  const [editing, setEditing] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  async function upload(file: File) {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
    const supported = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif', 'dng'].includes(extension) || file.type.startsWith('image/')
    if (!supported) { setMessage('Choose a JPG, JPEG, PNG, WebP, HEIC, HEIF, AVIF, or DNG image.'); return }
    setBusy(true); setMessage('Uploading image…')
    const data = new FormData(); data.append('file', file)
    const response = await fetch('/api/upload', { method: 'POST', body: data })
    const result = await response.json()
    setBusy(false)
    if (!response.ok) { setMessage(result.error ?? 'Upload failed.'); return }
    setForm((current) => ({ ...current, url: result.url })); setMessage('Image uploaded. Add the write-up and save it.')
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('Saving…')
    try {
      if (editing) { await updateMedia(editing, form); setAssets((items) => items.map((item) => item.id === editing ? { ...item, ...form } : item)) }
      else { const result = await createMedia(form); setAssets((items) => [{ ...form, id: result.id }, ...items]) }
      setForm(blank); setEditing(null); setMessage('Saved. Published media now appears on the public homepage.')
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to save media.') }
    finally { setBusy(false) }
  }
  function edit(asset: Asset) { setEditing(asset.id); setForm({ url: asset.url, title: asset.title, description: asset.description, placement: asset.placement, published: asset.published }); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  async function remove(id: string) { if (!window.confirm('Delete this media item?')) return; await deleteMedia(id); setAssets((items) => items.filter((item) => item.id !== id)) }
  return <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <form onSubmit={save} className="rounded-[2rem] bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold">{editing ? 'Edit gallery item' : 'Add gallery item'}</h2>
      <p className="mt-2 text-sm text-[#64776e]">Upload a photo, then add the words visitors should read with it.</p>
      <label className="mt-6 block text-sm font-bold">Image<input className="mt-2 block w-full rounded-2xl border border-[#cbd8ce] p-3 text-sm" type="file" accept="image/*,.jpg,.jpeg,.heic,.heif,.avif,.dng,.png,.webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file) }} /></label>
      {form.url && <img src={form.url} alt="Selected gallery preview" className="mt-4 aspect-video w-full rounded-2xl object-cover" />}
      <label className="mt-5 block text-sm font-bold">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-2 w-full rounded-2xl border border-[#cbd8ce] p-3" placeholder="A day of care in Abuja" /></label>
      <label className="mt-5 block text-sm font-bold">Write-up<textarea required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-2 min-h-32 w-full rounded-2xl border border-[#cbd8ce] p-3" placeholder="Tell the story behind this image…" /></label>
      <label className="mt-5 block text-sm font-bold">Show on<select value={form.placement} onChange={(event) => setForm({ ...form, placement: event.target.value })} className="mt-2 w-full rounded-2xl border border-[#cbd8ce] p-3"><option value="homepage">Homepage</option><option value="stories">Stories page</option><option value="both">Homepage and Stories</option></select></label>
      <label className="mt-5 flex items-center gap-3 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Publish immediately</label>
      {message && <p className="mt-4 text-sm text-[#a9553f]">{message}</p>}
      <button disabled={busy} className="mt-6 w-full rounded-full bg-[#c56b4b] px-5 py-3 font-bold text-white disabled:opacity-60" type="submit">{busy ? 'Saving…' : editing ? 'Update gallery item' : 'Save gallery item'}</button>
      {editing && <button type="button" onClick={() => { setEditing(null); setForm(blank) }} className="mt-3 w-full rounded-full border border-[#b9c9bd] px-5 py-3 font-bold">Cancel edit</button>}
    </form>
    <section className="rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-2xl font-semibold">Your gallery</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{assets.length ? assets.map((asset) => <article key={asset.id} className="overflow-hidden rounded-2xl border border-[#d9e2da]"><img src={asset.url} alt={asset.title} className="aspect-video w-full object-cover" /><div className="p-4"><p className="font-semibold">{asset.title}</p><p className="mt-2 line-clamp-3 text-sm text-[#64776e]">{asset.description}</p><p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#c56b4b]">{asset.published ? 'Published' : 'Draft'}</p><div className="mt-4 flex gap-3"><button type="button" onClick={() => edit(asset)} className="text-sm font-bold text-[#c56b4b]">Edit</button><button type="button" onClick={() => void remove(asset.id)} className="text-sm font-bold text-[#8a4a3e]">Delete</button></div></div></article>) : <p className="text-sm text-[#64776e]">No gallery items yet.</p>}</div></section>
  </div>
}
