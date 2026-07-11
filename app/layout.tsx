import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'תורה שבמרחב',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preload" href="/the-basics/TheBasics-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/the-basics/TheBasics-Medium.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/the-basics/TheBasics-Light.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
