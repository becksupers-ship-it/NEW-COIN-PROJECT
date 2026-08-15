import './globals.css'
import { Inter } from 'next/font/google'
import Providers from '../components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Coin Hub - NEW COIN PROJECT',
  description: 'Cryptocurrency market data and charts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
