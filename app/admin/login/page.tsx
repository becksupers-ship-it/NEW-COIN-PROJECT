'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { authClient } from '@/lib/auth-client'

export default function AdminLoginPage() {
  const router = useRouter(); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false)
  async function submit(event: React.FormEvent) { event.preventDefault(); setLoading(true); setError(''); const result = await authClient.signIn.email({ email, password }); if (result.error) setError('Unable to sign in. Check your credentials.'); else { router.push('/admin'); router.refresh() }; setLoading(false) }
  return <main className="grid min-h-screen place-items-center bg-[#17332d] px-5 text-[#f7f4eb]"><div className="w-full max-w-md"><Link href="/" className="text-sm font-bold text-[#e5b65c]">← Return to site</Link><p className="mt-16 text-xs font-bold uppercase tracking-[0.18em] text-[#e5b65c]">Admin portal</p><h1 className="mt-3 text-5xl font-semibold tracking-[-0.04em]">Welcome back.</h1><p className="mt-4 text-[#b9c9bd]">Manage the stories, programs, and people at the heart of Bonded Friends.</p><form onSubmit={submit} className="mt-10 rounded-3xl bg-[#f7f4eb] p-7 text-[#17332d]"><label className="text-sm font-bold">Email address<input required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-[#cbd8cc] bg-white p-4" type="email" /></label><label className="mt-5 block text-sm font-bold">Password<input required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-[#cbd8cc] bg-white p-4" type="password" /></label>{error && <p className="mt-4 text-sm text-[#b74f3a]">{error}</p>}<button disabled={loading} className="mt-6 w-full rounded-full bg-[#c56b4b] py-4 font-bold text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in to dashboard'}</button></form></div></main>
}
