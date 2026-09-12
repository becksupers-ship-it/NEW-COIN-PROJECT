import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHomepageContent } from '@/app/actions/homepage'
import HomepageEditor from '@/components/homepage-editor'

export const dynamic = 'force-dynamic'

export default async function HomepageAdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/admin/login')
  const content = await getHomepageContent()
  return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] sm:px-8 lg:px-12"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c56b4b]">Homepage manager</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.04em]">Control what people see.</h1><p className="mt-3 max-w-2xl text-[#64776e]">Update the homepage words, labels, numbers, and transparency percentages. Published changes appear on the public site immediately.</p><div className="mt-8"><HomepageEditor initial={content as unknown as Record<string, string | number>} /></div></div></main>
}
