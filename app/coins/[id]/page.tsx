'use client'

import useSWR from 'swr'
import axios from 'axios'
import PriceChart from '../../../components/PriceChart'
import { useState, useEffect } from 'react'
import { useWatchlist } from '../../../components/WatchlistContext'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function CoinDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [days, setDays] = useState<'1'|'7'|'30'|'90'|'365'>('30')
  const { data: coin } = useSWR(`/api/coins/${id}` , fetcher)
  const { data: market } = useSWR(() => (id ? `/api/coins/${id}/market_chart?days=${days}` : null), fetcher)
  const { add, ids, remove } = useWatchlist()

  useEffect(() => {
    // scroll to top when id changes
    window.scrollTo(0, 0)
  }, [id])

  if (!coin) return <div className="p-4">Loading coin…</div>

  const inWatchlist = ids.includes(id)

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4">
        <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold">{coin.name} <span className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</span></h1>
          <div className="text-lg">${coin.market_data.current_price.usd.toLocaleString()}</div>
        </div>
        <div className="ml-auto">
          {!inWatchlist ? (
            <button onClick={() => add(id)} className="px-3 py-1 border rounded">Add to Watchlist</button>
          ) : (
            <button onClick={() => remove(id)} className="px-3 py-1 border rounded">Remove from Watchlist</button>
          )}
        </div>
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold mb-2">Price ({days} days)</h2>
          <div className="flex gap-2">
            {(['1','7','30','90','365'] as const).map((d) => (
              <button key={d} onClick={() => setDays(d)} className={`px-2 py-1 border rounded ${days===d? 'bg-slate-100 dark:bg-slate-800':''}`}>Last {d}</button>
            ))}
          </div>
        </div>

        {market ? (
          <div className="mt-4 border p-4">
            <PriceChart prices={market.prices} />
          </div>
        ) : (
          <div>Loading market data…</div>
        )}
      </section>

      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4">
          <h3 className="font-semibold">Market Data</h3>
          <ul className="mt-2 text-sm">
            <li>Market Cap: ${coin.market_data.market_cap.usd?.toLocaleString()}</li>
            <li>Circulating Supply: {coin.market_data.circulating_supply?.toLocaleString()}</li>
            <li>Total Supply: {coin.market_data.total_supply ? coin.market_data.total_supply.toLocaleString() : 'N/A'}</li>
            <li>24h High / Low: ${coin.market_data.high_24h.usd?.toLocaleString()} / ${coin.market_data.low_24h.usd?.toLocaleString()}</li>
          </ul>
        </div>

        <div className="border p-4">
          <h3 className="font-semibold">Links</h3>
          <ul className="mt-2 text-sm list-disc ml-6">
            {coin.links.homepage[0] && <li><a href={coin.links.homepage[0]} target="_blank" rel="noreferrer">Homepage</a></li>}
            {coin.links.subreddit_url && <li><a href={coin.links.subreddit_url} target="_blank" rel="noreferrer">Reddit</a></li>}
            {coin.links.repos_url?.github?.length > 0 && <li><a href={coin.links.repos_url.github[0]} target="_blank" rel="noreferrer">GitHub</a></li>}
          </ul>
        </div>
      </section>
    </main>
  )
}
