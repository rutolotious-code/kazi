'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  const { user, isAdmin, loading } = useAuth(); const router = useRouter()
  useEffect(() => { if (!loading && (!user || !isAdmin)) router.replace('/login') }, [loading, user, isAdmin, router])
  if (loading || !user || !isAdmin) return <main className="section"><h1>Checking permissions…</h1></main>
  return <AdminDashboard adminUid={user.uid} />
}
