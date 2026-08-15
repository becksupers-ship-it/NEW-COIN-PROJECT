'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [mode, setMode] = useState<'light'|'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return (localStorage.getItem('theme') as 'light'|'dark') || 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    localStorage.setItem('theme', mode)
  }, [mode])

  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} className="px-2 py-1 border rounded">
      {mode === 'light' ? 'Dark' : 'Light'}
    </button>
  )
}
