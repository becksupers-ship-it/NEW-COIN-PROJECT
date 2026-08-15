'use client'
import useSWR from 'swr'
import axios from 'axios'
import Sparkline from '../components/Sparkline'
import Link from 'next/link'
import { useState } from 'react'
import { useWatchlist } from '../components/WatchlistContext'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function HomePage() {
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const url = `/api/coins/markets?page=${page}`
  const { data: coins, error } = useSWR(url, fetcher)
  const { ids, add, remove } = useWatchlist()

  const filtered = (coins || []).filter((c: any) => `${c.name} ${c.symbol}`.toLowerCase().includes(q.toLowerCase()))

  if (error) return <div className="p-4">Failed to load</div>
  if (!coins) return <div className="p-4">Loading…</div>

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Markets</h1>
        <div className="flex items-center gap-2">
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="border px-2 py-1 rounded" />
        </div>
      </div>

      <table className="w-full table-auto">
        <thead>
          <tr className="text-left text-sm text-gray-600">
            <th className="py-2">Coin</th>
            <th>Price</th>
            <th>24h</th>
            <th>Market Cap</th>
            <th>Sparkline</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((c: any) => (
            <tr key={c.id} className="border-t">
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <img src={c.image} alt={c.name} className="w-6 h-6" />
                  <div>
                    <div className="font-medium">
                      <Link href={`/coins/${c.id}`}>{c.name}</Link>
                    </div>
                    <div className="text-sm text-gray-500">{c.symbol.toUpperCase()}</div>
                  </div>
                </div>
              </td>
              <td>${c.current_price.toLocaleString()}</td>
              <td className={c.price_change_percentage_24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                {c.price_change_percentage_24h?.toFixed(2)}%
              </td>
              <td>${c.market_cap.toLocaleString()}</td>
              <td style={{ width: 120 }}>
                <Sparkline data={c.sparkline_in_7d.price} positive={c.price_change_percentage_24h >= 0} />
              </td>
              <td>
                {!ids.includes(c.id) ? (
                  <button onClick={() => add(c.id)} className="px-2 py-1 border rounded">Add</button>
                ) : (
                  <button onClick={() => remove(c.id)} className="px-2 py-1 border rounded">Remove</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex items-center justify-between mt-4">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page}</div>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </main>
  )
}
