'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { ArrowLeft, ArrowRight, Bath, BedDouble, Car, MapPin, MessageCircle } from 'lucide-react'
import { db } from '@/lib/firebase'
import { formatPrice, optimizeImage } from '@/lib/format'
import type { Listing } from '@/lib/types'

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let unsubscribe: () => void = () => undefined
    params.then(({ id }) => {
      unsubscribe = onSnapshot(doc(db, 'listings', id), (snapshot) => {
        if (!snapshot.exists() || snapshot.data().status !== 'approved') setNotFound(true)
        else setListing({ id: snapshot.id, ...snapshot.data() } as Listing)
        setLoading(false)
      }, () => { setNotFound(true); setLoading(false) })
    })
    return () => unsubscribe()
  }, [params])

  if (loading) return <main className="section"><div className="listing-skeleton" /></main>
  if (notFound || !listing) return <main className="section"><span className="eyebrow">LISTING</span><h1>Property not found</h1><p>This listing may have been removed or is no longer available.</p><Link className="button olive" href="/listings"><ArrowLeft /> Back to listings</Link></main>

  return <main className="listing-detail-page"><div className="section listing-detail"><Link className="back-link" href="/listings"><ArrowLeft /> Back to listings</Link><div className="listing-detail-grid"><div className="listing-detail-gallery">{listing.images?.length ? listing.images.map((image, index) => <div className="listing-detail-image" key={`${image}-${index}`}><Image src={optimizeImage(image, 1400)} alt={`${listing.title} photo ${index + 1}`} fill sizes="(max-width: 900px) 100vw, 60vw" unoptimized /></div>) : <div className="listing-detail-image listing-image-empty" />}</div><article className="listing-detail-copy"><span className="eyebrow">{listing.category} · {listing.type}</span><h1>{listing.title}</h1><p className="listing-location"><MapPin /> {listing.location}</p><p className="listing-detail-price">{formatPrice(listing.price, listing.type)}</p><p>{listing.description || 'Enquire with our team for full property details and availability.'}</p><div className="listing-facts">{listing.bedrooms != null && <span><BedDouble /> {listing.bedrooms} beds</span>}{listing.bathrooms != null && <span><Bath /> {listing.bathrooms} baths</span>}</div><div className="listing-detail-actions"><Link className="button red" href={`/contact?listing=${encodeURIComponent(listing.title)}`}>Enquire about this property <ArrowRight /></Link><a className="button outline" href="https://wa.me/27834224505" target="_blank" rel="noreferrer"><MessageCircle /> WhatsApp the team</a></div></article></div></div></main>
}
