'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore'
import { Shell } from '@/components/site'
import { useAuth } from '@/components/auth-provider'
import { ListingForm } from '@/components/listing-form'
import { ListingCard } from '@/components/listing-card'
import { db } from '@/lib/firebase'
import type { Listing } from '@/lib/types'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<'add' | 'mine'>('add')
  const [listings, setListings] = useState<Listing[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.replace('/login')
    if (!user) return
    const listingsQuery = query(collection(db, 'listings'), where('ownerUid', '==', user.uid))
    return onSnapshot(listingsQuery, (snapshot) => {
      setListings(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Listing)))
      setError('')
    }, (snapshotError) => {
      console.error('Could not load your listings:', snapshotError)
      setError('Could not load your listings. Please try again.')
    })
  }, [loading, router, user])

  async function deleteListing(listing: Listing) {
    if (!window.confirm(`Delete “${listing.title}”?`)) return
    try { await deleteDoc(doc(db, 'listings', listing.id)) } catch (error) {
      console.error('Could not delete listing:', error)
      setError('Could not delete that listing. Please try again.')
    }
  }

  if (loading || !user) return <Shell><section className="section"><h1>{loading ? 'Loading your dashboard…' : 'Redirecting to sign in…'}</h1></section></Shell>
  const name = user.displayName || user.email?.split('@')[0] || 'there'
  return <Shell><section className="section dashboard-section"><span className="eyebrow">CLIENT DASHBOARD</span><h1>Welcome, {name}</h1><p>Manage your property submissions and track their approval status.</p><div className="dashboard-tabs" role="tablist"><button className={tab === 'add' ? 'button red' : 'button outline'} onClick={() => setTab('add')} role="tab" aria-selected={tab === 'add'}>Add a listing</button><button className={tab === 'mine' ? 'button red' : 'button outline'} onClick={() => setTab('mine')} role="tab" aria-selected={tab === 'mine'}>My listings</button></div>{tab === 'add' ? <ListingForm onSuccess={() => setTab('mine')} /> : <div className="my-listings">{error && <p className="form-error" role="alert">{error}</p>}{listings.length === 0 && !error ? <p className="muted">You have not submitted any listings yet.</p> : listings.map((listing) => <div className="my-listing" key={listing.id}><ListingCard listing={listing} /><div className={`status-badge status-${listing.status}`}>{listing.status === 'approved' ? 'Approved' : listing.status === 'rejected' ? 'Rejected' : 'Pending'}</div><button className="button outline delete-button" onClick={() => deleteListing(listing)}>Delete</button></div>)}</div>}</section></Shell>
}
