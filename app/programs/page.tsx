import Link from 'next/link'
import { ArrowUpRight, HeartHandshake, School, ShieldPlus, Stethoscope, Utensils } from 'lucide-react'
import { PageIntro, SiteShell } from '@/components/site-shell'

const programs = [
  ['Widow Empowerment','Livelihoods','Micro-grants, skills training, and peer support that help widows build independent futures.','/programs/widow-empowerment',HeartHandshake],
  ['Emergency Humanitarian Response','Relief','Rapid food, shelter, and essential support for families facing crisis.','/programs/emergency-humanitarian-response',ShieldPlus],
  ['Back-to-School Programme','Education','School supplies, fees, and encouragement that keep children learning.','/programs/back-to-school-programme',School],
  ['Food & Relief Outreach','Nutrition','Neighbourhood distributions that put nourishing food on family tables.','/programs/food-relief-outreach',Utensils],
  ["Children's Welfare",'Protection','Safe spaces, mentoring, and practical support for children at risk.','/programs/childrens-welfare',HeartHandshake],
  ['Healthcare Assistance','Healthcare','Medical outreaches and referrals that make care easier to reach.','/programs/healthcare-assistance',Stethoscope],
]
export default function ProgramsPage(){return <SiteShell><main><PageIntro eyebrow="Our programs" title="Practical care, built around real needs." text="We work with communities to turn urgent needs into steady pathways for dignity, opportunity, and belonging."/><section className="mx-auto grid max-w-7xl gap-5 px-5 pb-24 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">{programs.map(([title, category, text, href, Icon], i)=>{const ProgramIcon=Icon as typeof HeartHandshake;return <article key={title as string} className="group flex min-h-72 flex-col rounded-[2rem] border border-[#d9e1d8] bg-white p-7 transition hover:-translate-y-1 hover:border-[#c56b4b] dark:bg-[#1b332e]"><div className="flex items-center justify-between"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#edf3eb] text-[#c56b4b]"><ProgramIcon size={21}/></span><span className="text-xs font-bold uppercase tracking-widest text-[#789086]">0{i+1}</span></div><p className="mt-8 text-xs font-bold uppercase tracking-widest text-[#c56b4b]">{category as string}</p><h2 className="mt-2 text-2xl font-semibold">{title as string}</h2><p className="mt-3 text-sm leading-6 text-[#64776e]">{text as string}</p><Link href={href as string} className="mt-auto flex items-center gap-2 pt-6 text-sm font-bold text-[#c56b4b]">Explore program <ArrowUpRight size={16}/></Link></article>})}</section></main></SiteShell>}
