import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Listings | NQ Kazi Investments',
  description: 'Browse approved residential, commercial and industrial properties across South Africa.',
}

export default function ListingsLayout({ children }: { children: React.ReactNode }) {
  return children
}
