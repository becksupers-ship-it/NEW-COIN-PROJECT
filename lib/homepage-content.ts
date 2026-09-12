import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { homepageContent } from '@/lib/db/schema'

export const homepageDefaults = {
  id: 'default', heroEyebrow: 'Rooted in care', heroTitle: 'Together, we make hope practical.', heroDescription: 'Bonded Friends Outreach Initiative walks alongside widows, children, older people, and communities across Nigeria with care that restores dignity and opens doors.', promiseLabel: 'Our promise', promiseText: 'No one should walk alone.', peopleReached: '2,480+', peopleReachedLabel: 'people reached this year', metric1Value: '2,480', metric1Label: 'Widows reached', metric2Value: '6,200', metric2Label: 'Children supported', metric3Value: '1,150', metric3Label: 'Elderly assisted', metric4Value: '38', metric4Label: 'Communities reached', directProgrammes: 75, fundraising: 15, administration: 10,
}

export async function getHomepageContent() {
  const rows = await db.select().from(homepageContent).where(eq(homepageContent.id, 'default')).limit(1)
  return rows[0] ?? homepageDefaults
}
