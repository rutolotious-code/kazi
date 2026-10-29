'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Shell } from '@/components/site'
import { ListingCard } from '@/components/listing-card'
import { useApprovedListings } from '@/hooks/use-approved-listings'

type Filter = 'All' | 'Residential' | 'Commercial' | 'Industrial' | 'Sale' | 'Rental'

const filters: Filter[] = ['All', 'Residential', 'Commercial', 'Industrial', 'Sale', 'Rental']

export default function Page() {
  const [filter, setFilter] = useState<Filter>('All')
  const { listings, loading } = useApprovedListings()
  const visibleListings = listings.filter((listing) => {
    if (filter === 'All') return true
    if (filter === 'Sale' || filter === 'Rental') return listing.type === filter.toLowerCase()
    return listing.category === filter
  })

  return (
    <Shell>
      <section className="page-hero listings-hero">
        <div className="container">
          <span className="eyebrow">LISTINGS</span>
          <h1>Properties currently in our portfolio.</h1>
          <p>Homes, offices and industrial spaces actively in motion. Get in touch for the full portfolio.</p>
        </div>
      </section>
      <section className="section">
        <div className="filters" aria-label="Filter listings">
          {filters.map((item) => (
            <button key={item} type="button" className={`filter ${filter === item ? 'selected' : ''}`} onClick={() => setFilter(item)} aria-pressed={filter === item}>
              {item}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="property-grid" aria-label="Loading listings">
            {[1, 2, 3].map((item) => <div className="listing-skeleton" key={item} />)}
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {visibleListings.length ? (
              <motion.div key={filter} className="property-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {visibleListings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
              </motion.div>
            ) : (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="listing-empty">
                No listings available right now. <Link href="/contact">Please contact us.</Link>
              </motion.p>
            )}
          </AnimatePresence>
        )}
      </section>
    </Shell>
  )
}
