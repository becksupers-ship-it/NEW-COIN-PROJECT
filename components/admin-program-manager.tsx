'use client'

import { useState } from 'react'
import { Archive, Check, Edit3, Eye, Plus, Save, X } from 'lucide-react'
import { createProgram, deleteProgram, updateProgram, updateProgramStatus } from '@/app/actions/programs'

type Program = { id: string; title: string; category: string; summary: string; description: string; imageUrl: string | null; status: string }
type Form = { title: string; category: string; summary: string; description: string; imageUrl: string }
const empty: Form = { title: '', category: '', summary: '', description: '', imageUrl: '' }

export function AdminProgramManager({ initialPrograms }: { initialPrograms: Program[] }) {
  const [programs, setPrograms] = useState(initialPrograms)
  const [form, setForm] = useState<Form>(empty)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  function edit(program: Program) {
    setEditingId(program.id)
    setForm({ title: program.title, category: program.category, summary: program.summary, description: program.description, imageUrl: program.imageUrl ?? '' })
    setOpen(true)
    setMessage('')
  }

  async function save() {
    setBusy(true)
    setMessage('')
    try {
      if (editingId) await updateProgram(editingId, form)
      else await createProgram(form)
      window.location.reload()
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to save program')
    } finally { setBusy(false) }
  }

  async function changeStatus(id: string, status: 'draft' | 'published' | 'archived') {
    setBusy(true)
    try { await updateProgramStatus(id, status); setPrograms((items) => items.map((item) => item.id === id ? { ...item, status } : item)) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to update status') }
    finally { setBusy(false) }
  }

  async function remove(id: string) {
    if (!window.confirm('Delete this program permanently?')) return
    setBusy(true)
    try { await deleteProgram(id); setPrograms((items) => items.filter((item) => item.id !== id)) }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Unable to delete program') }
    finally { setBusy(false) }
  }

  return <>
    {message && <p role="alert" className="mb-4 rounded-xl bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#a94f37]">{message}</p>}
    {open && <section className="mb-8 rounded-[1.5rem] border border-[#d9e1d8] bg-[#fffdf8] p-5 shadow-sm">
      <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">{editingId ? 'Edit program' : 'Add program'}</h2><button onClick={() => setOpen(false)} aria-label="Close editor"><X /></button></div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {([['title','Program title'],['category','Category'],['summary','Short summary'],['imageUrl','Image URL']] as const).map(([key, label]) => <label key={key} className="grid gap-2 text-sm font-semibold">{label}<input value={form[key]} onChange={(event) => setForm({ ...form, [key]: event.target.value })} className="rounded-xl border border-[#cbd8cc] bg-white px-4 py-3 font-normal outline-none focus:border-[#c56b4b]" /></label>)}
        <label className="grid gap-2 text-sm font-semibold sm:col-span-2">Full description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={5} className="rounded-xl border border-[#cbd8cc] bg-white px-4 py-3 font-normal outline-none focus:border-[#c56b4b]" /></label>
      </div>
      <button disabled={busy} onClick={save} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#c56b4b] px-5 py-3 text-sm font-bold text-white disabled:opacity-60"><Save size={16} /> {busy ? 'Saving…' : editingId ? 'Save changes' : 'Create draft'}</button>
    </section>}
    <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm"><div className="hidden grid-cols-[1.2fr_0.7fr_1.5fr_130px] gap-4 border-b border-[#d9e1d8] px-6 py-4 text-xs font-bold uppercase tracking-widest text-[#789086] md:grid"><span>Program</span><span>Category</span><span>Summary</span><span>Status</span></div>{programs.map((program) => <article key={program.id} className="grid gap-4 border-b border-[#edf1eb] px-5 py-6 last:border-0 md:grid-cols-[1.2fr_0.7fr_1.5fr_130px] md:items-center"><div><h3 className="font-semibold">{program.title}</h3><p className="mt-1 text-xs text-[#789086]">{program.status === 'published' ? 'Visible publicly' : program.status === 'archived' ? 'Hidden from public' : 'Not published'}</p></div><p className="text-sm text-[#64776e]">{program.category}</p><p className="text-sm leading-6 text-[#64776e]">{program.summary}</p><div className="flex flex-wrap gap-2 md:justify-end"><button onClick={() => edit(program)} className="rounded-full border border-[#cbd8cc] p-2" aria-label={`Edit ${program.title}`}><Edit3 size={15} /></button>{program.status !== 'published' && <button disabled={busy} onClick={() => changeStatus(program.id, 'published')} className="rounded-full bg-[#dce8da] p-2 text-[#4d7164]" aria-label={`Publish ${program.title}`}><Check size={15} /></button>}{program.status === 'published' && <button disabled={busy} onClick={() => changeStatus(program.id, 'archived')} className="rounded-full bg-[#f1eee5] p-2 text-[#897a5c]" aria-label={`Archive ${program.title}`}><Archive size={15} /></button>}{program.status === 'archived' && <button disabled={busy} onClick={() => changeStatus(program.id, 'draft')} className="rounded-full border border-[#cbd8cc] p-2" aria-label={`Restore ${program.title}`}><Eye size={15} /></button>}<button onClick={() => remove(program.id)} className="rounded-full border border-[#f0c9bd] p-2 text-[#a94f37]" aria-label={`Delete ${program.title}`}><X size={15} /></button></div></article>)}</div>
    <button onClick={() => { setEditingId(null); setForm(empty); setOpen(true); setMessage('') }} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c56b4b] px-5 py-4 font-bold text-white"><Plus size={18} /> Add program</button>
  </>
}
