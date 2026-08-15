'use client'
import { useAlerts } from '../../components/AlertContext'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export default function AlertsPage() {
  const { alerts, add, remove } = useAlerts()
  const [coin, setCoin] = useState('bitcoin')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState<'above'|'below'>('below')

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>
      <div className="mb-4 border p-4">
        <div className="mb-2">
          <label className="mr-2">Coin</label>
          <input value={coin} onChange={(e) => setCoin(e.target.value)} className="border px-2 py-1" />
        </div>
        <div className="mb-2">
          <label className="mr-2">Condition</label>
          <select value={condition} onChange={(e) => setCondition(e.target.value as any)} className="border px-2 py-1">
            <option value="below">Below</option>
            <option value="above">Above</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="mr-2">Target Price (USD)</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} className="border px-2 py-1" />
        </div>
        <div>
          <button onClick={() => { add({ id: uuidv4(), coinId: coin, targetPrice: Number(price), condition }); setPrice('') }} className="px-3 py-1 border rounded">Create Alert</button>
        </div>
      </div>

      <div>
        <h2 className="font-semibold">Existing Alerts</h2>
        {alerts.length === 0 ? <div className="mt-2">No alerts</div> : (
          <ul className="mt-2">
            {alerts.map((a: any) => (
              <li key={a.id} className="flex items-center justify-between border-b py-2">
                <div>{a.coinId} - {a.condition} ${a.targetPrice}</div>
                <button onClick={() => remove(a.id)} className="px-2 py-1 border rounded">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
