'use client'
import Providers from './Providers'
import { WatchlistProvider } from './WatchlistContext'

export default function ProvidersWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <WatchlistProvider>{children}</WatchlistProvider>
    </Providers>
  )
}
