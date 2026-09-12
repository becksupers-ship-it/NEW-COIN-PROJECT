import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { getHomepageContent } from '@/lib/homepage-content'
import { AdminHomepageEditor } from '@/components/admin-homepage-editor'
export const dynamic='force-dynamic'
export default async function HomepageAdminPage(){const session=await auth.api.getSession({headers:await headers()});if(!session?.user)redirect('/admin/login');const content=await getHomepageContent();return <main className="min-h-screen bg-[#f3f6f1] px-5 py-10 text-[#17332d] lg:px-12"><div className="mx-auto max-w-5xl"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c56b4b]">Content manager</p><h1 className="mt-2 text-4xl font-semibold">Homepage content</h1><p className="mt-3 text-[#64776e]">Edit any words and numbers shown on the public homepage.</p><div className="mt-8"><AdminHomepageEditor initial={content}/></div></div></main>}
