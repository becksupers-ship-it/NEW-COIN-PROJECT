'use client'
import { useState } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import CompareChart from '../../components/CompareChart'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function ComparePage() {
  const [ids, setIds] = useState(['bitcoin', 'ethereum'])

  const charts = ids.map((id) => useSWR(`/api/coins/${id}/market_chart?days=30`, fetcher))

  const allLoaded = charts.every((c) => c.data)

  const datasets = charts.map((c, i) => ({ id: ids[i], prices: c.data ? c.data.prices : [] }))

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
        <div className="border p-4">
          <CompareChart datasets={datasets} />
        </div>
      )}
    </main>
  )
}
