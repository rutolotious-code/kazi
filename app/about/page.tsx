import { Shell } from '@/components/site'
import { AboutPage } from '@/components/public-pages'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About Us | NQ Kazi Investments', description: 'Meet NQ Kazi Investments, a trusted South African property partner.' }

export default function Page() {
  return <Shell><AboutPage /></Shell>
}
