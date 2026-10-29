import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'
export const metadata: Metadata = { title:'NQ Kazi Investments | Premium Real Estate', description:'Residential, commercial and industrial property solutions across South Africa.' }
export const viewport: Viewport = { themeColor:'#304c08', colorScheme:'light' }
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><AuthProvider>{children}</AuthProvider><Analytics /></body></html> }
