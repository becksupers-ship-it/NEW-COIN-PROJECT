import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bonded Friends Outreach Initiative | Hope made practical',
  description: 'Bonded Friends Outreach Initiative walks alongside widows, children, older people, and communities across Nigeria.',
  generator: 'v0.app',
  icons: {
    icon: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1782209731991-EKxLV5AyT7x7k2tBqH92aOk48KUSEz.png',
    apple: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1782209731991-EKxLV5AyT7x7k2tBqH92aOk48KUSEz.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: '#fbfaf6',
  userScalable: true,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#fbfaf6]">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
