'use client'
import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import PriceChart from '../../components/PriceChart'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function ComparePage() {
  const [ids, setIds] = useState(['bitcoin', 'ethereum'])

  const charts = ids.map((id) => useSWR(`/api/coins/${id}/market_chart?days=30`, fetcher))

  const allLoaded = charts.every((c) => c.data)

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Compare</h1>
      <div className="mb-4">
        <label className="mr-2">Coin 1</label>
        <input defaultValue={ids[0]} onBlur={(e) => setIds([e.target.value, ids[1]])} className="border px-2 py-1 mr-2" />
        <label className="mr-2">Coin 2</label>
        <input defaultValue={ids[1]} onBlur={(e) => setIds([ids[0], e.target.value])} className="border px-2 py-1" />
      </div>

      {!allLoaded && <div>Loading charts…</div>}

      {allLoaded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {charts.map((c, i) => (
            <div key={i} className="border p-4">
              <h3 className="font-semibold mb-2">{ids[i]}</h3>
              <PriceChart prices={c.data.prices} />
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
