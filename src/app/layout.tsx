import { ThemeProvider } from '@/components/providers/ThemeProvider'

import '../styles/globals.css'

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import TanstackProvider from '@/components/providers/TanstackProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Zealventure - Blogs',
  description: 'Where Adventure and Fitness Meet',
  keywords: ['Zealer', 'Zealventure', 'Blogs', 'Adventure', 'Fitness'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <TanstackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>{children}</main>
          </ThemeProvider>
        </TanstackProvider>
      </body>
    </html>
  )
}
