'use client'

import { SessionProvider } from 'next-auth/react'
import { WatchlistProvider } from './WatchlistContext'

export default function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
  return (
    <SessionProvider session={session}>
      <WatchlistProvider>{children}</WatchlistProvider>
    </SessionProvider>
  )
}
