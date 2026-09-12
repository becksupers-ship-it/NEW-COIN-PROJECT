'use server'

import { randomUUID } from 'crypto'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { eq, desc } from 'drizzle-orm'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { impactStories, posts } from '@/lib/db/schema'

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
}

const clean = (value: string) => value.trim().replace(/[<>]/g, '')

export async function createStory(input: { name: string; location: string; quote: string; category: string; imageUrl?: string; videoUrl?: string; rating: number; published: boolean }) {
  await requireAdmin()
  const required = [input.name, input.location, input.quote, input.category]
  if (required.some((value) => !value?.trim())) throw new Error('Name, location, category, and quote are required.')
  const id = randomUUID()
  await db.insert(impactStories).values({ id, name: clean(input.name), location: clean(input.location), quote: clean(input.quote), category: clean(input.category), imageUrl: input.imageUrl?.trim() || null, videoUrl: input.videoUrl?.trim() || null, rating: Math.min(5, Math.max(1, Math.round(input.rating))), published: input.published })
  revalidatePath('/'); revalidatePath('/stories')
  return { ok: true }
}

export async function createPost(input: { title: string; slug: string; type: string; excerpt: string; content: string; imageUrl?: string; published: boolean }) {
  await requireAdmin()
  if ([input.title, input.slug, input.type, input.excerpt, input.content].some((value) => !value?.trim())) throw new Error('Title, slug, type, excerpt, and content are required.')
  const slug = clean(input.slug).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  if (!slug) throw new Error('Enter a valid URL slug.')
  await db.insert(posts).values({ id: randomUUID(), slug, title: clean(input.title), type: clean(input.type), excerpt: clean(input.excerpt), content: input.content.trim(), imageUrl: input.imageUrl?.trim() || null, published: input.published, publishedAt: new Date() })
  revalidatePath('/'); revalidatePath('/news')
  return { ok: true }
}

export async function getPublishedStories() { return db.select().from(impactStories).where(eq(impactStories.published, true)).orderBy(desc(impactStories.createdAt)) }
export async function getPublishedPosts() { return db.select().from(posts).where(eq(posts.published, true)).orderBy(desc(posts.publishedAt)) }
export async function getAdminStories() { await requireAdmin(); return db.select().from(impactStories).orderBy(desc(impactStories.createdAt)) }
export async function getAdminPosts() { await requireAdmin(); return db.select().from(posts).orderBy(desc(posts.publishedAt)) }

export async function setStoryPublished(id: string, published: boolean) { await requireAdmin(); await db.update(impactStories).set({ published }).where(eq(impactStories.id, id)); revalidatePath('/'); revalidatePath('/stories') }
export async function setPostPublished(id: string, published: boolean) { await requireAdmin(); await db.update(posts).set({ published }).where(eq(posts.id, id)); revalidatePath('/'); revalidatePath('/news') }
export async function deleteStory(id: string) { await requireAdmin(); await db.delete(impactStories).where(eq(impactStories.id, id)); revalidatePath('/'); revalidatePath('/stories') }
export async function deletePost(id: string) { await requireAdmin(); await db.delete(posts).where(eq(posts.id, id)); revalidatePath('/'); revalidatePath('/news') }

