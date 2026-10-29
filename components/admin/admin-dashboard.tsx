'use client'

import { useCallback, useState } from 'react'
import { Shell } from '@/components/site'
import { ListingForm } from '@/components/listing-form'
import { PendingApprovals } from './pending-approvals'
import { AllListings } from './all-listings'
import { Branding } from './branding'
import { Enquiries } from './enquiries'

export function AdminDashboard({ adminUid }: { adminUid: string }) {
  const [tab, setTab] = useState<'pending' | 'all' | 'add' | 'branding' | 'enquiries'>('pending')
  const [pendingCount, setPendingCount] = useState(0)
  const [enquiryCount, setEnquiryCount] = useState(0)
  const updateCount = useCallback((count: number) => setPendingCount(count), [])
  const updateEnquiryCount = useCallback((count: number) => setEnquiryCount(count), [])
  return <Shell><section className="section admin-page"><span className="eyebrow">ADMINISTRATION</span><h1>Operations dashboard</h1><p>Review submissions and keep the public property portfolio current.</p><nav className="admin-tabs" aria-label="Admin sections"><button className={tab === 'pending' ? 'active' : ''} onClick={() => setTab('pending')}>Pending approvals <span className="count-badge">{pendingCount}</span></button><button className={tab === 'all' ? 'active' : ''} onClick={() => setTab('all')}>All listings</button><button className={tab === 'add' ? 'active' : ''} onClick={() => setTab('add')}>Add listing</button><button className={tab === 'branding' ? 'active' : ''} onClick={() => setTab('branding')}>Branding</button><button className={tab === 'enquiries' ? 'active' : ''} onClick={() => setTab('enquiries')}>Enquiries <span className="count-badge">{enquiryCount}</span></button></nav>{tab === 'pending' && <PendingApprovals adminUid={adminUid} onCount={updateCount} />}{tab === 'all' && <AllListings />}{tab === 'add' && <div className="admin-form-wrap"><ListingForm onSuccess={() => setTab('all')} /></div>}{tab === 'branding' && <Branding />}{tab === 'enquiries' && <Enquiries onCount={updateEnquiryCount} />}</section></Shell>
}
