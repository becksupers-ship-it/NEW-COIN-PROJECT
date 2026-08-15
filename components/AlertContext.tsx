'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Alert = { id: string; coinId: string; targetPrice: number; condition: 'above' | 'below' }

const AlertContext = createContext<any>(null)

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('alerts')
      if (raw) setAlerts(JSON.parse(raw))
    } catch (e) {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('alerts', JSON.stringify(alerts))
    } catch (e) {}
  }, [alerts])

  function add(a: Alert) {
    setAlerts((s) => [...s, a])
  }
  function remove(id: string) {
    setAlerts((s) => s.filter((x) => x.id !== id))
  }
  function update(id: string, patch: Partial<Alert>) {
    setAlerts((s) => s.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  return <AlertContext.Provider value={{ alerts, add, remove, update }}>{children}</AlertContext.Provider>
}

export function useAlerts() {
  return useContext(AlertContext)
}
