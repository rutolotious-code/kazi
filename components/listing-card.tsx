'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { formatPrice, listingLabel, optimizeImage } from '@/lib/format'
import type { Listing } from '@/lib/types'

export function ListingCard({ listing }: { listing: Listing }) {
  const image = listing.coverImage || listing.images?.[0]
  return <motion.article className="property-card listing-card" initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45 }}>
    <Link href={`/listings/${listing.id}`} className="listing-card-link">
      {image ? <div className="listing-image"><Image src={optimizeImage(image)} alt={listing.title} fill sizes="(max-width: 700px) 100vw, 50vw" /></div> : <div className="listing-image listing-image-empty" aria-label="No property image" />}
      <div className="listing-card-content"><span className="eyebrow">{listingLabel(listing.category, listing.type)}</span><h3>{listing.title}</h3><p>{listing.location}</p><div className="listing-card-footer"><strong className="price">{formatPrice(listing.price, listing.type)}</strong>{listing.bedrooms != null || listing.bathrooms != null ? <small>{listing.bedrooms ?? '—'} bd · {listing.bathrooms ?? '—'} ba</small> : null}</div></div>
    </Link>
  </motion.article>
}
