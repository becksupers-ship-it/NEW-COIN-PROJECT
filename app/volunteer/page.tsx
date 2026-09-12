import { getHomepageContent } from '@/app/actions/homepage'
import VolunteerForm from '@/components/volunteer-form'
export const dynamic = 'force-dynamic'
export default async function VolunteerPage(){const content=await getHomepageContent();return <VolunteerForm title={content.volunteerTitle} description={content.volunteerDescription} note={content.volunteerNote}/>} 
