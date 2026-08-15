'use client'

import { SessionProvider } from 'next-auth/react'
import { WatchlistProvider } from './WatchlistContext'
import { AlertProvider } from './AlertContext'
import AlertsChecker from './AlertsChecker'

export default function Providers({ children, session }: { children: React.ReactNode; session?: any }) {
  return (
    <SessionProvider session={session}>
      <AlertProvider>
        <WatchlistProvider>
          <AlertsChecker />
          {children}
        </WatchlistProvider>
      </AlertProvider>
    </SessionProvider>
  )
}
