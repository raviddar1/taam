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
        {/* p5.js: defer = downloads in parallel with HTML, executes after parse, never blocks render */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script defer src="/p5.min.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
