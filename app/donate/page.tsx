import { getHomepageContent } from '@/app/actions/homepage'
import DonationForm from '@/components/donation-form'
export const dynamic = 'force-dynamic'
export default async function DonatePage(){const content=await getHomepageContent();return <DonationForm title={content.donationTitle} description={content.donationDescription}/>} 
