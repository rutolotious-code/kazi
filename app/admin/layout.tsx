import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin | NQ Kazi Investments', description: 'Review and manage NQ Kazi Investments listings and enquiries.' }
export default function AdminLayout({ children }: { children: React.ReactNode }) { return children }
