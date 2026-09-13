'use client'

import { useRef, useState } from 'react'
import { createMember, deleteMember, updateMember } from '@/app/actions/members'

type Member = {
  id: string
  name: string
  occupation: string
  stateOfOrigin: string
  currentState: string
  impact: string
  contribution: string
  office: string
  imageUrl: string | null
  published: boolean
}

type MemberForm = Omit<Member, 'id' | 'imageUrl'> & { imageUrl: string }
const emptyForm: MemberForm = { name: '', occupation: '', stateOfOrigin: '', currentState: '', impact: '', contribution: '', office: '', imageUrl: '', published: true }
const fields: [keyof MemberForm, string, string][] = [['name', 'Full name', 'text'], ['occupation', 'Occupation', 'text'], ['stateOfOrigin', 'State of origin', 'text'], ['currentState', 'Current state of residence', 'text'], ['office', 'Post / office in the NGO', 'text'], ['impact', 'Impact in the organization', 'textarea'], ['contribution', 'Contributions and responsibilities', 'textarea']]

export function MembersManager({ initialMembers }: { initialMembers: Member[] }) {
  const [members, setMembers] = useState(initialMembers)
  const [form, setForm] = useState<MemberForm>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function edit(member: Member) {
    setEditingId(member.id)
    setForm({ ...member, imageUrl: member.imageUrl || '' })
    setMessage('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function uploadImage(file: File) {
    setUploading(true)
    setMessage('')
    try {
      const data = new FormData()
      data.append('file', file)
      data.append('type', 'executive-image')
      const response = await fetch('/api/upload', { method: 'POST', body: data, credentials: 'same-origin', cache: 'no-store' })
      const result = await response.json().catch(() => ({ error: 'The upload service returned an invalid response.' }))
      if (!response.ok) throw new Error(result.error || 'Unable to upload picture.')
      setForm((current) => ({ ...current, imageUrl: result.url }))
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to upload picture.')
    } finally {
      setUploading(false)
    }
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setMessage('')
    try {
      if (editingId) await updateMember(editingId, form)
      else await createMember(form)
      const saved = editingId ? members.map((member) => member.id === editingId ? { ...member, ...form, imageUrl: form.imageUrl || null } : member) : [{ id: crypto.randomUUID(), ...form, imageUrl: form.imageUrl || null }, ...members]
      setMembers(saved)
      setForm(emptyForm)
      setEditingId(null)
      setMessage('Member saved and published settings updated.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save member.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(id: string) {
    if (!window.confirm('Remove this verified member?')) return
    await deleteMember(id)
    setMembers((current) => current.filter((member) => member.id !== id))
  }

  return <div className="grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
    <form onSubmit={save} className="rounded-[2rem] border border-[#d9e1d8] bg-[#fffdf8] p-6 shadow-sm lg:p-8">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c56b4b]">Executive profile</p><h2 className="mt-2 text-3xl font-semibold">{editingId ? 'Edit executive' : 'Add executive'}</h2></div>{editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }} className="text-sm font-bold text-[#c56b4b]">Cancel</button>}</div>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">{fields.map(([key, label, type]) => { const value = String(form[key] ?? ''); return type === 'textarea' ? <label key={key} className="grid gap-2 text-sm font-semibold sm:col-span-2">{label}<textarea required value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} rows={4} className="rounded-xl border border-[#cbd8cc] bg-white px-4 py-3 font-normal outline-none focus:border-[#c56b4b]" /></label> : <label key={key} className="grid gap-2 text-sm font-semibold">{label}<input required value={value} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="rounded-xl border border-[#cbd8cc] bg-white px-4 py-3 font-normal outline-none focus:border-[#c56b4b]" /></label> })}</div>
      <div className="mt-5 grid gap-3 text-sm font-semibold"><span>Executive picture</span><input ref={fileRef} type="file" accept="image/*,.jpg,.jpeg,.heic,.heif,.avif,.dng,.png,.webp" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadImage(file) }} /><button type="button" disabled={uploading} onClick={() => fileRef.current?.click()} className="rounded-xl border border-dashed border-[#c56b4b] bg-[#fff8f2] px-4 py-4 text-left text-[#a94f37] disabled:opacity-60">{uploading ? 'Uploading picture…' : form.imageUrl ? 'Replace picture from phone gallery' : 'Choose picture from phone gallery'}</button>{form.imageUrl && <img src={form.imageUrl} alt="Selected executive" className="h-48 w-full rounded-xl object-cover" />}</div>
      <label className="mt-5 flex items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} /> Show this member publicly</label>
      <button disabled={busy || uploading} className="mt-7 w-full rounded-full bg-[#c56b4b] px-5 py-4 font-bold text-white disabled:opacity-60">{busy ? 'Saving…' : editingId ? 'Save member changes' : 'Add executive'}</button>
      {message && <p className="mt-4 rounded-xl bg-[#edf4ed] p-3 text-sm font-semibold">{message}</p>}
    </form>
    <section><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c56b4b]">Directory</p><h2 className="mt-2 text-3xl font-semibold">Executives</h2></div><span className="text-sm text-[#64776e]">{members.length} total</span></div><div className="mt-5 grid gap-4 sm:grid-cols-2">{members.length ? members.map((member) => <article key={member.id} className="overflow-hidden rounded-[1.5rem] border border-[#d9e1d8] bg-white"><div className="flex gap-4 p-5">{member.imageUrl ? <img src={member.imageUrl} alt={member.name} className="h-20 w-20 rounded-2xl object-cover" /> : <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#e5b65c] text-2xl font-bold text-[#17332d]">{member.name.slice(0, 1)}</div>}<div className="min-w-0"><h3 className="font-bold">{member.name}</h3><p className="mt-1 text-sm text-[#c56b4b]">{member.office}</p><p className="mt-1 text-xs text-[#64776e]">{member.published ? 'Published' : 'Hidden'}</p></div></div><div className="border-t border-[#edf1eb] px-5 py-3 text-sm text-[#64776e]">{member.occupation} · {member.currentState}</div><div className="flex gap-2 px-5 pb-5"><button type="button" onClick={() => edit(member)} className="rounded-full border border-[#cbd8cc] px-4 py-2 text-sm font-bold">Edit</button><button type="button" onClick={() => void remove(member.id)} className="rounded-full border border-[#e3b7a9] px-4 py-2 text-sm font-bold text-[#a94f37]">Remove</button></div></article>) : <p className="rounded-3xl border border-dashed border-[#cbd8cc] p-8 text-[#64776e]">No executives have been added yet.</p>}</div></section>
  </div>
}
