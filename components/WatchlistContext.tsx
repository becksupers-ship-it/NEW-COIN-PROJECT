'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type WatchlistContextType = {
  ids: string[]
  add: (id: string) => void
  remove: (id: string) => void
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined)

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('watchlist')
      if (raw) setIds(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('watchlist', JSON.stringify(ids))
    } catch (e) {}
  }, [ids])

  function add(id: string) {
    setIds((s) => Array.from(new Set([...s, id])))
  }
  function remove(id: string) {
    setIds((s) => s.filter((x) => x !== id))
  }

  return <WatchlistContext.Provider value={{ ids, add, remove }}>{children}</WatchlistContext.Provider>
}

export function useWatchlist() {
  const ctx = useContext(WatchlistContext)
  if (!ctx) throw new Error('useWatchlist must be used inside WatchlistProvider')
  return ctx
}
