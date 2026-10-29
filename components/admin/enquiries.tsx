'use client'

import { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'

type Enquiry = { id: string; source?: string; name?: string; email?: string; phone?: string; message?: string; createdAt?: { toDate?: () => Date } }

export function Enquiries({ onCount }: { onCount: (count: number) => void }) {
  const [items, setItems] = useState<Enquiry[]>([])
  const [error, setError] = useState<string | null>(null)
  useEffect(() => onSnapshot(query(collection(db, 'enquiries'), orderBy('createdAt', 'desc')), (snapshot) => {
    setItems(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Enquiry)))
    onCount(snapshot.size)
  }, (reason) => { console.error('Unable to load enquiries:', reason); setError('Enquiries could not be loaded. Please try again.') }), [onCount])
  const remove = async (id: string) => {
    if (!window.confirm('Delete this enquiry?')) return
    try { await deleteDoc(doc(db, 'enquiries', id)) } catch (reason) { console.error('Unable to delete enquiry:', reason); setError('This enquiry could not be deleted.') }
  }
  return <div className="admin-stack">
    {error && <p className="form-message">{error}</p>}
    {!items.length && !error ? <div className="empty-state"><h2>No enquiries yet.</h2><p>New contact requests will appear here.</p></div> : items.map((item) => <article className="admin-card enquiry-card" key={item.id}><div className="enquiry-heading"><div><span className="eyebrow">{item.source || 'Contact'}</span><h2>{item.name || 'Unnamed enquiry'}</h2></div><button className="button outline danger" type="button" onClick={() => remove(item.id)}>Delete</button></div><div className="enquiry-contact"><a href={`mailto:${item.email || ''}`}>{item.email || 'No email provided'}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}<time>{item.createdAt?.toDate ? item.createdAt.toDate().toLocaleString('en-ZA') : 'Date unavailable'}</time></div><p>{item.message || 'No message provided.'}</p></article>)}
  </div>
}
