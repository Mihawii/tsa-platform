import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CustomCursor from '@/components/CustomCursor'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'TSA Platform',
  description: 'The Start Academy - Learning Platform',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} dot-grid`}>
        <div className="vignette" />
        {children}
        <CustomCursor />
      </body>
    </html>
  )
} 