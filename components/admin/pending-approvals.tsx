'use client'

import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { formatPrice, listingLabel } from '@/lib/format'
import type { Listing } from '@/lib/types'

function dateValue(value: unknown) {
  if (value && typeof value === 'object' && 'toDate' in value) return (value as { toDate: () => Date }).toDate().toLocaleDateString('en-ZA')
  return 'Recently submitted'
}

export function PendingApprovals({ adminUid, onCount }: { adminUid: string; onCount: (count: number) => void }) {
  const [items, setItems] = useState<Listing[]>([])
  const [message, setMessage] = useState('')
  useEffect(() => onSnapshot(query(collection(db, 'listings'), where('status', '==', 'pending')), (snapshot) => { const next = snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Listing)); setItems(next); onCount(next.length) }, (error) => { console.error('Could not load pending listings:', error); setMessage('Could not load pending listings.') }), [onCount])
  async function updateStatus(item: Listing, status: 'approved' | 'rejected') { try { await updateDoc(doc(db, 'listings', item.id), status === 'approved' ? { status, approvedAt: serverTimestamp(), approvedBy: adminUid } : { status }); setMessage(status === 'approved' ? 'Listing approved.' : 'Listing rejected.') } catch (error) { console.error('Could not update listing:', error); setMessage('Could not update that listing.') } }
  async function remove(item: Listing) { if (!window.confirm(`Delete ${item.title}?`)) return; try { await deleteDoc(doc(db, 'listings', item.id)); setMessage('Listing deleted.') } catch (error) { console.error('Could not delete listing:', error); setMessage('Could not delete that listing.') } }
  return <div className="admin-tab-content"><div className="admin-feedback" role="status">{message}</div>{items.length === 0 ? <p className="admin-empty">No pending listings.</p> : <div className="admin-pending-list">{items.map((item) => <article className="admin-review-card" key={item.id}><div className="admin-photo-grid"><img className="admin-cover" src={item.coverImage || item.images?.[0]} alt={item.title} /><div>{(item.images || []).slice(1).map((image, index) => <img key={image} src={image} alt={`${item.title} image ${index + 2}`} />)}</div></div><div className="admin-review-copy"><span className="eyebrow">{listingLabel(item.category, item.type)}</span><h2>{item.title}</h2><p><strong>{item.location}</strong> · {formatPrice(item.price, item.type)} · {item.bedrooms ?? '—'} bd / {item.bathrooms ?? '—'} ba</p><p>{item.description || 'No description provided.'}</p><p className="admin-meta">Submitted by {item.ownerName} ({item.ownerEmail}) · {dateValue(item.createdAt)}</p><div className="admin-actions"><button className="button olive" onClick={() => updateStatus(item, 'approved')}>Approve</button><button className="button secondary" onClick={() => updateStatus(item, 'rejected')}>Reject</button><button className="button danger" onClick={() => remove(item)}>Delete</button></div></div></article>)}</div>}</div>
}
