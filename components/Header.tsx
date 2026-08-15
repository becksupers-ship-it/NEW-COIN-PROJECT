'use client'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import AuthButton from './AuthButton'

export default function Header() {
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur sticky top-0 z-20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">Coin Hub</Link>
        <nav className="flex items-center gap-4">
          <Link href="/compare">Compare</Link>
          <Link href="/watchlist">Watchlist</Link>
          <Link href="/alerts">Alerts</Link>
          <ThemeToggle />
          <AuthButton />
        </nav>
      </div>
    </header>
  )
}
