'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { AdminDashboard } from '@/components/admin/admin-dashboard'

export default function AdminPage() {
  const { user, isAdmin, adminCheckError, loading } = useAuth(); const router = useRouter()
  useEffect(() => { if (!loading && (!user || !isAdmin)) router.replace('/login') }, [loading, user, isAdmin, router])
  if (loading) return <main className="section"><h1>Checking permissions…</h1></main>
  if (!user) return <main className="section"><h1>Redirecting to sign in…</h1></main>
  if (adminCheckError) return <main className="section"><span className="eyebrow">ADMIN ACCESS</span><h1>Admin verification unavailable</h1><p className="form-error" role="alert">Firestore returned <strong>{adminCheckError}</strong> while checking your role. Confirm the <code>admins/{user.uid}</code> document and Firestore rules.</p></main>
  if (!isAdmin) return <main className="section"><h1>Admin access required</h1><p>Your account is signed in as a standard user.</p></main>
  return <AdminDashboard adminUid={user.uid} />
}
