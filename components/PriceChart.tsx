'use client'

import { Line } from 'react-chartjs-2'
import 'chart.js/auto'

export default function PriceChart({ prices, volumes }: { prices: [number, number][]; volumes?: [number, number][] }) {
  const labels = prices.map((p) => new Date(p[0]).toLocaleDateString())
  const priceData = prices.map((p) => p[1])
  const volData = volumes ? volumes.map((v) => v[1]) : []

  const cfg = {
    labels,
    datasets: [
      {
        type: 'bar',
        label: 'Volume',
        data: volData,
        yAxisID: 'yVolume',
        backgroundColor: 'rgba(148,163,184,0.3)',
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
      {
        type: 'line',
        label: 'Price (USD)',
        data: priceData,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        tension: 0.2,
        pointRadius: 0,
        yAxisID: 'yPrice',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      yPrice: {
        type: 'linear',
        position: 'left',
        ticks: { callback: (value: any) => `$${Number(value).toLocaleString()}` },
      },
      yVolume: {
        type: 'linear',
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: { callback: (value: any) => `${Number(value).toLocaleString()}` },
      },
    },
    plugins: { legend: { display: true } },
  }

  return (
    <div style={{ height: 360 }}>
      {/* @ts-ignore */}
      <Line data={cfg} options={options} />
    </div>
  )
}
