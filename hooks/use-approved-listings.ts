'use client'

import { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Listing } from '@/lib/types'

export function useApprovedListings() {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const listingsQuery = query(collection(db, 'listings'), where('status', '==', 'approved'))
    return onSnapshot(listingsQuery, (snapshot) => {
      const next = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as Listing)
      next.sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt))
      setListings(next)
      setLoading(false)
      setError(null)
    }, (snapshotError) => {
      console.error('Unable to load approved listings:', snapshotError)
      setError(snapshotError)
      setLoading(false)
    })
  }, [])

  return { listings, loading, error }
}

function timestampValue(value: unknown): number {
  if (value && typeof value === 'object' && 'toMillis' in value && typeof value.toMillis === 'function') return value.toMillis()
  if (value instanceof Date) return value.getTime()
  return Date.now()
}
