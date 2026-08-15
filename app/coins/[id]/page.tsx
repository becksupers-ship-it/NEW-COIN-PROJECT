import useSWR from 'swr'
import axios from 'axios'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function CoinDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { data: coin } = useSWR(`/api/coins/${id}` , fetcher)
  const { data: market } = useSWR(() => (coin ? `/api/coins/${id}/market_chart?days=30` : null), fetcher)

  if (!coin) return <div className="p-4">Loading coin…</div>

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-4">
        <img src={coin.image.large} alt={coin.name} className="w-12 h-12" />
        <div>
          <h1 className="text-2xl font-bold">{coin.name} <span className="text-sm text-gray-500">{coin.symbol.toUpperCase()}</span></h1>
          <div className="text-lg">${coin.market_data.current_price.usd.toLocaleString()}</div>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="font-semibold mb-2">Price (30 days)</h2>
        {market ? (
          <div style={{ height: 300 }}>
            {/* Simple chart using chart.js */}
            {/* For brevity, reuse Sparkline or implement a larger chart */}
            <div className="text-sm text-gray-500">Chart placeholder (implement detailed chart)</div>
          </div>
        ) : (
          <div>Loading market data…</div>
        )}
      </section>

      <section className="mt-6">
        <h3 className="font-semibold">Links</h3>
        <ul className="list-disc ml-6 mt-2 text-sm">
          {coin.links.homepage[0] && <li><a href={coin.links.homepage[0]} target="_blank">Homepage</a></li>}
          {coin.links.subreddit_url && <li><a href={coin.links.subreddit_url} target="_blank">Reddit</a></li>}
        </ul>
      </section>
    </main>
  )
}
