'use client'

import { useEffect, useMemo, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { listingLabel } from '@/lib/format'
import type { Listing, ListingStatus } from '@/lib/types'

export function AllListings() {
  const [items, setItems] = useState<Listing[]>([]); const [filter, setFilter] = useState<'all' | ListingStatus>('all'); const [message, setMessage] = useState('')
  useEffect(() => onSnapshot(collection(db, 'listings'), (snapshot) => setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Listing))), (error) => { console.error('Could not load all listings:', error); setMessage('Could not load listings.') }), [])
  const visible = useMemo(() => filter === 'all' ? items : items.filter((item) => item.status === filter), [filter, items])
  async function changeStatus(item: Listing, status: ListingStatus) { try { await updateDoc(doc(db, 'listings', item.id), { status }); setMessage(status === 'approved' ? 'Listing approved.' : 'Listing unpublished.') } catch (error) { console.error('Could not change listing status:', error); setMessage('Could not update that listing.') } }
  async function remove(item: Listing) { if (!window.confirm(`Delete ${item.title}?`)) return; try { await deleteDoc(doc(db, 'listings', item.id)); setMessage('Listing deleted.') } catch (error) { console.error('Could not delete listing:', error); setMessage('Could not delete that listing.') } }
  return <div className="admin-tab-content"><div className="admin-filter-row">{(['all', 'approved', 'pending', 'rejected'] as const).map((value) => <button key={value} className={`admin-filter ${filter === value ? 'active' : ''}`} onClick={() => setFilter(value)}>{value[0].toUpperCase() + value.slice(1)}</button>)}</div><div className="admin-feedback" role="status">{message}</div>{visible.length === 0 ? <p className="admin-empty">No listings found.</p> : <div className="admin-table">{visible.map((item) => <div className="admin-row" key={item.id}><img src={item.coverImage || item.images?.[0]} alt="" /><div><strong>{item.title}</strong><span>{listingLabel(item.category, item.type)}</span></div><span className={`status-badge ${item.status}`}>{item.status}</span><div className="admin-actions"><button className="text-button" onClick={() => changeStatus(item, item.status === 'approved' ? 'pending' : 'approved')}>{item.status === 'approved' ? 'Unpublish' : 'Approve'}</button><button className="text-button danger-text" onClick={() => remove(item)}>Delete</button></div></div>)}</div>}</div>
}
