import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/auth-provider'
import './globals.css'
export const metadata: Metadata = { title:'NQ Kazi Investments | Premium Real Estate', description:'Residential, commercial and industrial property solutions across South Africa.' }
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const viewport: Viewport = { themeColor:'#304c08', colorScheme:'light', userScalable:false }
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body className={`${inter.variable} ${playfair.variable}`}><AuthProvider>{children}</AuthProvider><Analytics /></body></html> }
