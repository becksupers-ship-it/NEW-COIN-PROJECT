import 'chart.js/auto'
import { Line } from 'react-chartjs-2'

export default function Sparkline({ data, positive }: { data: number[]; positive?: boolean }) {
  const cfg = {
    labels: data.map((_, i) => i),
    datasets: [
      {
        data,
        borderColor: positive ? '#16a34a' : '#dc2626',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { x: { display: false }, y: { display: false } },
    plugins: { legend: { display: false } },
  }

  return (
    <div style={{ height: 40 }}>
      {/* @ts-ignore */}
      <Line data={cfg} options={options} />
    </div>
  )
}
