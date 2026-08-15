'use client'

import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

export default function CompareChart({ datasets }: { datasets: { id: string; prices: [number, number][] }[] }) {
  if (!datasets || datasets.length === 0) return null

  // Use timestamps from first dataset as labels
  const labels = datasets[0].prices.map((p) => new Date(p[0]).toLocaleDateString())

  const chartDatasets = datasets.map((d, i) => {
    const prices = d.prices.map((p) => p[1])
    const first = prices[0] || 1
    const normalized = prices.map((v) => (v / first) * 100)
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#a78bfa']
    return {
      label: d.id,
      data: normalized,
      borderColor: colors[i % colors.length],
      backgroundColor: colors[i % colors.length],
      tension: 0.2,
      pointRadius: 0,
    }
  })

  const cfg = { labels, datasets: chartDatasets }
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' } }, scales: { x: { display: false }, y: { ticks: { callback: (v: any) => `${Math.round(v)}%` } } } }

  return (
    <div style={{ height: 360 }}>
      {/* @ts-ignore */}
      <Line data={cfg} options={options} />
    </div>
  )
}
