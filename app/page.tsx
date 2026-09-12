'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ArrowRight, Menu, Moon, ShieldCheck, Sparkles, Sun, Users, X } from 'lucide-react'

const navItems = [
  ['About us', '/about'],
  ['Our programs', '/programs'],
  ['Stories of impact', '/stories'],
  ['News & events', '/news'],
]

const metrics = [
  ['2,480', 'Widows reached'],
  ['6,200', 'Children supported'],
  ['1,150', 'Elderly assisted'],
  ['38', 'Communities reached'],
]

const values = [
  ['Compassion', 'We lead with empathy, dignity, and a deep respect for every person we serve.'],
  ['Integrity', 'We steward every gift responsibly and keep our work open, accountable, and measurable.'],
  ['Empowerment', 'We create pathways for people to build brighter, more independent futures.'],
  ['Collaboration', 'We partner with communities and changemakers to make lasting progress together.'],
]

const stories = [
  { name: 'Amaka, 42', place: 'Enugu State', quote: 'The sewing grant gave me more than a machine. It gave me the confidence to provide for my children again.', image: '/images/hero-community.png' },
  { name: 'Daniel, 11', place: 'Abuja FCT', quote: 'I can now go to school with my friends. Thank you for believing in my future.', image: '/images/hero-community.png' },
]

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className={darkMode ? 'dark min-h-screen bg-[#12221f] text-[#f7f4eb]' : 'min-h-screen bg-[#fbfaf6] text-[#17332d]'}>
      <header className="sticky top-0 z-30 border-b border-[#d9e1d8] bg-[#fbfaf6]/95 backdrop-blur dark:border-[#2d4942] dark:bg-[#12221f]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Bonded Friends Outreach Initiative home">
            <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1782209731991-EKxLV5AyT7x7k2tBqH92aOk48KUSEz.png" alt="Bonded Friends Outreach Initiative crest" className="h-12 w-12 object-contain" />
            <span className="max-w-[180px] text-[11px] font-bold uppercase leading-tight tracking-[0.18em]">Bonded Friends<br />Outreach Initiative</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium lg:flex">
            {navItems.map(([label, href]) => <Link key={href} href={href} className="transition-colors hover:text-[#c56b4b]">{label}</Link>)}
          </nav>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[#d9e1d8]" onClick={() => setDarkMode((v) => !v)} aria-label="Toggle theme">{darkMode ? <Sun size={17} /> : <Moon size={17} />}</button>
            <Link href="/donate" className="hidden rounded-full bg-[#c56b4b] px-5 py-3 text-sm font-bold text-white shadow-sm transition-transform hover:-translate-y-0.5 sm:block">Donate now</Link>
            <button className="grid h-10 w-10 place-items-center rounded-full border border-[#d9e1d8] lg:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle navigation">{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
          </div>
        </div>
        {menuOpen && <nav className="flex flex-col gap-4 border-t border-[#d9e1d8] px-5 py-5 lg:hidden">{navItems.map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</Link>)}<Link href="/donate" className="font-bold text-[#c56b4b]">Donate now</Link></nav>}
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eaf0e7] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#4d7164]"><Sparkles size={14} /> Rooted in care</div>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.03] tracking-[-0.04em] text-[#17332d] dark:text-[#f7f4eb] sm:text-6xl lg:text-7xl">Together, we make <em className="font-serif font-normal text-[#c56b4b]">hope</em> practical.</h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-[#5f716a] dark:text-[#b4c2bb]">Bonded Friends Outreach Initiative walks alongside widows, children, older people, and communities across Nigeria with care that restores dignity and opens doors.</p>
            <div className="mt-9 flex flex-wrap gap-3"><Link href="/donate" className="inline-flex items-center gap-2 rounded-full bg-[#c56b4b] px-6 py-4 text-sm font-bold text-white">Make an impact <ArrowRight size={16} /></Link><Link href="/programs" className="rounded-full border border-[#b9c9bd] px-6 py-4 text-sm font-bold">Explore our work</Link></div>
            <div className="mt-10 flex items-center gap-3 text-sm text-[#5f716a]"><div className="flex -space-x-2"><span className="h-8 w-8 rounded-full border-2 border-[#fbfaf6] bg-[#e5b65c]" /><span className="h-8 w-8 rounded-full border-2 border-[#fbfaf6] bg-[#c56b4b]" /><span className="h-8 w-8 rounded-full border-2 border-[#fbfaf6] bg-[#6f9380]" /></div><span><strong className="text-[#17332d]">2,480+</strong> people reached this year</span></div>
          </div>
          <div className="relative overflow-hidden rounded-[2rem] bg-[#dce8da] p-3"><div className="relative aspect-[0.9] overflow-hidden rounded-[1.5rem]"><Image src="/images/hero-community.png" alt="Community members gathered at an outreach" fill className="object-cover" priority /></div><div className="absolute bottom-7 left-7 right-7 rounded-2xl bg-[#17332d]/90 p-5 text-[#f7f4eb] backdrop-blur-sm"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.18em] text-[#b9d2bc]">Our promise</p><p className="mt-1 text-lg font-semibold">No one should walk alone.</p></div><ShieldCheck className="text-[#e5b65c]" size={28} /></div></div></div>
        </section>

        <section className="border-y border-[#d9e1d8] bg-[#edf3eb] dark:border-[#2d4942] dark:bg-[#1b332e]"><div className="mx-auto grid max-w-7xl grid-cols-2 gap-0 px-5 lg:grid-cols-4 lg:px-8">{metrics.map(([value, label]) => <div key={label} className="border-r border-[#d9e1d8] px-4 py-7 first:pl-0 last:border-0 lg:px-8"><p className="text-3xl font-semibold tracking-[-0.04em] text-[#c56b4b]">{value}</p><p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-[#587167]">{label}</p></div>)}</div></section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c56b4b]">What guides us</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Care that is <em className="font-serif font-normal text-[#c56b4b]">felt</em> and seen.</h2></div><div className="grid gap-8 sm:grid-cols-2">{values.map(([title, text], i) => <div key={title} className="border-t border-[#cbd8cc] pt-5"><span className="text-sm font-bold text-[#c56b4b]">0{i + 1}</span><h3 className="mt-4 text-xl font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#64776e]">{text}</p></div>)}</div></div></section>

        <section className="bg-[#17332d] px-5 py-20 text-[#f7f4eb] lg:px-8"><div className="mx-auto max-w-7xl"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e5b65c]">Transparency is trust</p><h2 className="mt-3 max-w-lg text-4xl font-semibold tracking-[-0.035em]">Where your kindness goes.</h2></div><p className="max-w-sm text-sm leading-6 text-[#b9c9bd]">Every contribution is stewarded carefully, so more of your generosity reaches the people and places it is meant for.</p></div><div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1fr]"><div className="flex items-center justify-center"><div className="relative grid h-64 w-64 place-items-center rounded-full" style={{ background: 'conic-gradient(#e5b65c 0 75%, #c56b4b 75% 90%, #6f9380 90% 100%)' }}><div className="grid h-40 w-40 place-items-center rounded-full bg-[#17332d] text-center"><span className="text-3xl font-semibold">100%</span><span className="text-xs uppercase tracking-[0.16em] text-[#b9c9bd]">accounted for</span></div></div></div><div className="flex flex-col justify-center gap-5">{[['75%', 'Direct programmes', 'The people and work at the heart of our mission.', '#e5b65c'], ['15%', 'Fundraising', 'Building a stronger circle of support.', '#c56b4b'], ['10%', 'Administration', 'The thoughtful systems behind every outcome.', '#6f9380']].map(([percent, title, text, color]) => <div key={title} className="flex gap-4"><span className="mt-1 h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} /><div><p className="font-semibold">{percent} &nbsp; {title}</p><p className="mt-1 text-sm text-[#b9c9bd]">{text}</p></div></div>)}<p className="mt-3 text-xs text-[#91a89c]">Audited financial statements are available upon request.</p></div></div></div></section>

        <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#c56b4b]">Stories of impact</p><h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em]">Small steps. <em className="font-serif font-normal text-[#c56b4b]">Real change.</em></h2></div><Link href="/stories" className="hidden items-center gap-2 text-sm font-bold text-[#c56b4b] sm:flex">View all stories <ArrowRight size={16} /></Link></div><div className="mt-9 grid gap-6 md:grid-cols-2">{stories.map((story) => <article key={story.name} className="grid overflow-hidden rounded-3xl border border-[#d9e1d8] bg-white dark:bg-[#1b332e] sm:grid-cols-[0.8fr_1.2fr]"><div className="relative min-h-64"><Image src={story.image} alt="Community outreach moment" fill className="object-cover" /></div><div className="flex flex-col justify-between p-7"><div><div className="mb-7 flex gap-1 text-[#e5b65c]">★★★★★</div><p className="text-xl font-medium leading-8">“{story.quote}”</p></div><div className="mt-7 text-sm"><p className="font-bold">{story.name}</p><p className="text-[#6a7b73]">{story.place}</p></div></div></article>)}</div></section>

        <section className="mx-5 mb-20 overflow-hidden rounded-[2rem] bg-[#e5b65c] px-6 py-12 text-center lg:mx-auto lg:max-w-7xl lg:px-12"><Users className="mx-auto text-[#17332d]" size={30} /><h2 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.035em] text-[#17332d]">Your time, voice, or gift can change a life.</h2><p className="mx-auto mt-4 max-w-xl text-[#36564b]">There are many ways to stand with our communities. Start with the one that feels right for you.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/donate" className="rounded-full bg-[#17332d] px-6 py-3 text-sm font-bold text-white">Give today</Link><Link href="/volunteer" className="rounded-full border border-[#17332d]/30 px-6 py-3 text-sm font-bold text-[#17332d]">Become a volunteer</Link></div></section>
      </main>
      <footer className="border-t border-[#d9e1d8] px-5 py-10 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 text-sm text-[#667870] sm:flex-row"><p>© 2026 Bonded Friends Outreach Initiative</p><div className="flex gap-5"><Link href="/about">About</Link><Link href="/news">News</Link><Link href="/admin/login">Admin</Link></div></div></footer>
    </div>
  )
}
