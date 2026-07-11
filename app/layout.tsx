import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'תורה שבמרחב',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <head>
        {/* p5.js נדרש לפני קוד הסקטש — נטען ב-head ישירות */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/p5.min.js" />
      </head>
      <body>{children}</body>
    </html>
  )
}
