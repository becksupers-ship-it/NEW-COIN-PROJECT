'use client'

import { useEffect } from 'react'
import useSWR from 'swr'
import axios from 'axios'
import { useAlerts } from './AlertContext'

const fetcher = (url: string) => axios.get(url).then((r) => r.data)

export default function AlertsChecker() {
  const { alerts } = useAlerts()

  // Determine unique coin ids to query
  const coinIds = Array.from(new Set(alerts.map((a: any) => a.coinId))).join(',')
  const { data } = useSWR(() => (coinIds ? `/api/coins/markets?page=1` : null), fetcher, { refreshInterval: 60 * 1000 })

  useEffect(() => {
    if (!data || alerts.length === 0) return

    alerts.forEach((a: any) => {
      const coin = data.find((c: any) => c.id === a.coinId)
      if (!coin) return
      const price = coin.current_price
      const triggered = a.condition === 'above' ? price >= a.targetPrice : price <= a.targetPrice
      if (triggered) {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          new Notification(`${coin.name} alert`, { body: `${coin.symbol.toUpperCase()} is ${a.condition} ${a.targetPrice} (current ${price})` })
        }
      }
    })
  }, [data, alerts])

  useEffect(() => {
    if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
      Notification.requestPermission().then(() => {})
    }
  }, [])

  return null
}
