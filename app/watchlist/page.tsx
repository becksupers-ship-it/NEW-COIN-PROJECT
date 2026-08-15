'use client'
import useSWR from 'swr'
import axios from 'axios'
import { useWatchlist } from '../../components/WatchlistContext'
import Sparkline from '../../components/Sparkline'
import Link from 'next/link'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function WatchlistPage() {
  const { ids, remove } = useWatchlist()
  const url = `/api/coins/markets?page=1`
  const { data: coins } = useSWR(url, fetcher)

  if (!coins) return <div className="p-4">Loading…</div>

  const list = coins.filter((c: any) => ids.includes(c.id))

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Watchlist</h1>
      {list.length === 0 ? (
        <div>No coins in your watchlist yet.</div>
      ) : (
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
            {list.map((c: any) => (
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
                  <button onClick={() => remove(c.id)} className="px-2 py-1 border rounded">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  )
}
