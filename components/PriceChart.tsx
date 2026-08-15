'use client'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

export default function PriceChart({ prices }: { prices: [number, number][] }) {
  const labels = prices.map((p) => new Date(p[0]).toLocaleDateString())
  const data = prices.map((p) => p[1])

  const cfg = {
    labels,
    datasets: [
      {
        label: 'Price (USD)',
        data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.1)',
        tension: 0.2,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: true } },
    plugins: { legend: { display: false } },
  }

  return (
    <div style={{ height: 320 }}>
      {/* @ts-ignore */}
      <Line data={cfg} options={options} />
    </div>
  )
}
