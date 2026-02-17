import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'sonner'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ['latin'] })
const _playfair = Playfair_Display({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kod Steak Bar | Premium Steakhouse - Tetovo',
  description:
    'Experience the finest cuts at Kod Steak Bar. Premium dry-aged steaks, A5 Wagyu, craft cocktails, and world-class wines in an ultra-luxury setting in Tetovo, North Macedonia.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0B0B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(198, 167, 94, 0.2)',
              color: '#e8e8e8',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
