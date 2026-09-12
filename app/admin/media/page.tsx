import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getMediaAssets } from '@/app/actions/media'
import { MediaManager } from '@/components/media-manager'

export const dynamic = 'force-dynamic'

export default async function MediaManagerPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const assets = await getMediaAssets()
  return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] lg:px-10"><div className="mx-auto max-w-6xl"><Link href="/admin" className="inline-flex items-center gap-2 text-sm font-bold text-[#c56b4b]"><ArrowLeft size={16} /> Dashboard</Link><div className="mt-10"><p className="text-xs font-bold uppercase tracking-widest text-[#c56b4b]">Media library</p><h1 className="mt-2 text-4xl font-semibold">Images and write-ups</h1><p className="mt-2 max-w-2xl text-sm text-[#64776e]">Upload photos from your gallery, add the story behind each one, and publish it to the homepage.</p></div><MediaManager initialAssets={assets} /></div></main>
}
