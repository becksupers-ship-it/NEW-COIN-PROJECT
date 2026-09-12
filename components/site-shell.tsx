'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Menu, Moon, Sun, X } from 'lucide-react'
import { useState } from 'react'

const logo = 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1782209731991-EKxLV5AyT7x7k2tBqH92aOk48KUSEz.png'
const nav = [['About us','/about'],['Programs','/programs'],['Verified members','/verified-members'],['Impact stories','/stories'],['News & events','/news']]

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [dark, setDark] = useState(false)
  return <div className={dark ? 'dark min-h-screen bg-[#12221f] text-[#f7f4eb]' : 'min-h-screen bg-[#fbfaf6] text-[#17332d]'}>
    <header className="sticky top-0 z-40 border-b border-[#d9e1d8]/80 bg-[#fbfaf6]/95 backdrop-blur dark:border-[#2d4942] dark:bg-[#12221f]/95"><div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 lg:px-8">
      <Link href="/" className="flex items-center gap-3" onClick={() => setOpen(false)}><Image src={logo} alt="Bonded Friends crest" width={48} height={48} className="h-12 w-12 object-contain" /><span className="max-w-[185px] text-[10px] font-bold uppercase leading-tight tracking-[.18em]">Bonded Friends<br />Outreach Initiative</span></Link>
      <nav className="hidden items-center gap-7 text-sm font-semibold lg:flex">{nav.map(([label, href]) => <Link key={href} href={href} className="transition-colors hover:text-[#c56b4b]">{label}</Link>)}</nav>
      <div className="flex items-center gap-2"><button onClick={() => setDark(!dark)} aria-label="Toggle theme" className="grid h-10 w-10 place-items-center rounded-full border border-[#cbd8cc]">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><Link href="/donate" className="hidden rounded-full bg-[#c56b4b] px-5 py-3 text-sm font-bold text-white sm:block">Donate now</Link><button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="grid h-10 w-10 place-items-center rounded-full border border-[#cbd8cc] lg:hidden">{open ? <X size={18} /> : <Menu size={18} />}</button></div>
    </div>{open && <nav className="flex flex-col gap-4 border-t border-[#d9e1d8] px-5 py-5 lg:hidden">{nav.map(([label, href]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/donate" className="font-bold text-[#c56b4b]">Donate now</Link><Link href="/volunteer">Become a volunteer</Link></nav>}</header>
    {children}
    <footer className="border-t border-[#d9e1d8] px-5 py-12 dark:border-[#2d4942]"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-[#667870] sm:flex-row"><div><p className="font-bold text-[#17332d] dark:text-[#f7f4eb]">Bonded Friends Outreach Initiative</p><p className="mt-2">No one should walk alone.</p><a href="mailto:bondedfriendsoutreachinitiativ@gmail.com" className="mt-3 inline-block font-medium text-[#17332d] underline decoration-[#c56b4b] underline-offset-4 dark:text-[#f7f4eb]">bondedfriendsoutreachinitiativ@gmail.com</a></div><div className="flex flex-wrap gap-5"><Link href="/about">About</Link><Link href="/news">News</Link><Link href="/volunteer">Volunteer</Link><Link href="/admin/login">Admin portal</Link></div></div></footer>
  </div>
}

export function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="mx-auto max-w-7xl px-5 pb-12 pt-16 lg:px-8 lg:pt-24"><p className="text-xs font-bold uppercase tracking-[.2em] text-[#c56b4b]">{eyebrow}</p><h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-[-.05em] sm:text-7xl">{title}</h1><p className="mt-7 max-w-2xl text-lg leading-8 text-[#64776e] dark:text-[#b4c2bb]">{text}</p></div> }

export const fieldClass = 'w-full rounded-xl border border-[#cbd8cc] bg-white px-4 py-3.5 text-[#17332d] placeholder:text-[#8a9a91]'
