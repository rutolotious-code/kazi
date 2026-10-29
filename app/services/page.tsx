import { Shell } from '@/components/site'
import { ServicesPage } from '@/components/public-pages'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Our Services | NQ Kazi Investments', description: 'Residential, commercial and industrial property services across South Africa.' }

export default function Page() {
  return <Shell><ServicesPage /></Shell>
}
