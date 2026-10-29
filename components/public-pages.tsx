'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { ArrowRight, Award, BarChart3, BriefcaseBusiness, Building2, Compass, Factory, Home, LineChart, Mail, MapPin, MessageCircle, Phone, ShieldCheck, Sparkles, Target, TrendingUp, Users } from 'lucide-react'
import { db } from '@/lib/firebase'
import { useApprovedListings } from '@/hooks/use-approved-listings'
import { useBranding } from '@/hooks/use-branding'
import { ListingCard } from './listing-card'
import { Reveal, PageHero, services } from './site'

export function HomePage() {
  const { heroBgUrl } = useBranding()
  const { listings, loading, error } = useApprovedListings()
  const newestListing = listings[0]

  return (
    <>
      <section className="hero" style={{ '--hero-image': `url(${heroBgUrl})` } as React.CSSProperties}>
        <div className="hero-content">
          <span className="eyebrow">PREMIUM REAL ESTATE · SOUTH AFRICA</span>
          <h1>Where opportunity meets <em>prime property.</em></h1>
          <p>NQ Kazi Investments helps individuals, families and businesses acquire, lease and grow premium residential, commercial and industrial property nationwide.</p>
          <div className="actions">
            <Link className="button red" href="/listings">Browse listings <ArrowRight /></Link>
            <Link className="button outline" href="/contact">Book a consultation</Link>
          </div>
        </div>
      </section>
      <StatsStrip />
      <Reveal className="section">
        <div className="section-heading">
          <span className="eyebrow">WHAT WE DO</span>
          <h2>A complete real estate partner</h2>
          <p>From your first home to your next industrial portfolio acquisition — one trusted team across South Africa.</p>
        </div>
        <ServiceCards linkLabel="Learn more" />
      </Reveal>
      <section className="section split">
        <div className={`split-image ${newestListing?.coverImage ? 'listing-cover' : 'olive-placeholder'}`} style={newestListing?.coverImage ? { backgroundImage: `url(${newestListing.coverImage})` } : undefined} aria-label={newestListing ? `Newest approved listing: ${newestListing.title}` : undefined} />
        <div>
          <span className="eyebrow">ABOUT NQ KAZI</span>
          <h2>South African property, handled with precision.</h2>
          <p>We are a national real estate firm serving LSM 3 – 9 buyers, families, investors and SMMEs. Our team combines on-the-ground market knowledge with disciplined investment thinking to deliver outcomes that compound over time.</p>
          <ul className="checks"><li>Residential</li><li>Commercial</li><li>Industrial</li><li>Investment</li></ul>
          <Link className="button olive" href="/about">About us <ArrowRight /></Link>
        </div>
      </section>
      <section className="olive-section section">
        <div className="section-heading centered"><span className="eyebrow">WHY CLIENTS CHOOSE US</span><h2>Trust earned, not assumed.</h2></div>
        <div className="trust-grid">{[['National reach', 'Active across all nine South African provinces.'], ['Investor mindset', 'Every deal reviewed through long-term lens.'], ['Concierge service', 'Personal, responsive support from first call to handover.']].map(([title, text]) => <article key={title}><span className="trust-icon"><ShieldCheck /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="section featured">
        <div className="section-heading"><span className="eyebrow">FEATURED</span><h2>Hand-picked properties</h2><p>A glimpse of what&apos;s currently moving in our portfolio.</p><Link href="/listings">View all listings →</Link></div>
        {error ? <p className="form-error">We couldn&apos;t load listings right now. Please try again later.</p> : loading ? <div className="property-grid" aria-label="Loading listings"><div className="listing-skeleton" /><div className="listing-skeleton" /><div className="listing-skeleton" /></div> : listings.length ? <div className="property-grid">{listings.slice(0, 6).map((listing) => <ListingCard key={listing.id} listing={listing} />)}</div> : <p>No approved listings are available right now.</p>}
      </section>
      <EnquiryForm source="home" />
    </>
  )
}

function StatsStrip() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    const timer = window.setInterval(() => setCount((value) => value >= 9 ? 9 : value + 1), 90)
    return () => window.clearInterval(timer)
  }, [])
  return <section className="stats-strip" aria-label="NQ Kazi Investments facts"><b>{count} <small>PROVINCES<br />COVERED</small></b><b>3 <small>PROPERTY<br />SECTORS</small></b><b>1:1 <small>PERSONAL<br />SERVICE</small></b></section>
}

function ServiceCards({ linkLabel }: { linkLabel: string }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return <div className="cards">{services.map(([title, text, Icon]) => <article className="card" key={title}><div className="icon-box"><Icon /></div><h3>{title}</h3><p>{mounted ? text : ''}</p><Link href={linkLabel === 'Enquire' ? '/contact' : '/services'}>{linkLabel} <ArrowRight /></Link></article>)}</div>
}

export function AboutPage() {
  return <><PageHero eyebrow="ABOUT US" title="A national real estate firm built around you." text="NQ Kazi Investments serves clients across South Africa with residential, commercial and industrial property expertise — anchored by an investor mindset." /><section className="section split"><div className="split-image olive-placeholder" /><div><span className="eyebrow">OUR STORY</span><h2>Property is more than a transaction.</h2><p>We started NQ Kazi Investments because South Africans deserve a real estate partner who speaks their language — one that treats first-time buyers with the same seriousness as seasoned investors. Today we operate nationally, advising families and businesses on residential, commercial and industrial property opportunities.</p><p className="muted">Every relationship begins with listening, and every recommendation is grounded in market data, long-term thinking and genuine care for our clients&apos; outcomes.</p></div></section><section className="section off-white"><div className="section-heading"><span className="eyebrow">WHAT WE STAND FOR</span><h2>Our values</h2></div><div className="cards values-grid">{[[Award, 'Excellence', 'We hold every transaction to the highest professional standard.'], [Target, 'Integrity', 'Transparent advice, honest deals, no shortcuts.'], [Users, 'Client first', 'Tailored service for families, investors and SMMEs alike.'], [TrendingUp, 'Growth', 'We help our clients build wealth through property.']].map(([Icon, title, text]) => <article className="card" key={title as string}><div className="value-icon"><Icon /></div><h3>{title as string}</h3><p>{text as string}</p></article>)}</div></section><CtaSection /></>
}

export function ServicesPage() {
  return <><PageHero eyebrow="SERVICES" title="A full-spectrum real estate offering." text="We work across the residential, commercial and industrial markets — and we advise on value before we ever advise on price." /><section className="section"><ServiceCards linkLabel="Enquire" /></section><CtaSection /></>
}

function CtaSection() { return <section className="section cta-section"><span className="eyebrow">READY WHEN YOU ARE</span><h2>Ready to start a conversation?</h2><p>Our team is one call or message away.</p><Link className="button olive" href="/contact">Contact us <ArrowRight /></Link></section> }

export function EnquiryForm({ source, title = "Let's talk about your next move.", subtitle = "Whether you're buying your first home or expanding a commercial portfolio, our team is ready to help. Reach out for a confidential discussion.", submitLabel = 'Send enquiry' }: { source: string; title?: string; subtitle?: string; submitLabel?: string }) {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError('')
    const data = Object.fromEntries(new FormData(event.currentTarget))
    try { await addDoc(collection(db, 'enquiries'), { ...data, source, createdAt: serverTimestamp() }); setSent(true); event.currentTarget.reset() } catch (submissionError) { console.error('Unable to send enquiry:', submissionError); setError("Sorry, we couldn't send your message. Please WhatsApp or call 083 422 4505.") } finally { setLoading(false) }
  }
  return <section className="section contact"><div><span className="eyebrow">GET IN TOUCH</span><h2>{title}</h2><p>{subtitle}</p><div className="contact-lines"><a href="tel:+27834224505">Phone — 083 422 4505</a><a href="mailto:ntsaphoquwe@gmail.com">Email — ntsaphoquwe@gmail.com</a><span>Coverage — National, South Africa</span></div></div><form className="form-card form-grid" onSubmit={submit}><label className="field">NAME<input name="name" required /></label><label className="field">EMAIL<input name="email" type="email" required /></label><label className="field">PHONE<input name="phone" /></label><label className="field full">MESSAGE<textarea name="message" required /></label>{error && <p className="form-error full" role="alert">{error}</p>}{sent && <p className="form-success full" role="status">Thank you, we&apos;ll be in touch soon.</p>}<button className="button olive" disabled={loading}>{loading ? 'Sending…' : submitLabel} <ArrowRight /></button></form></section>
}

export function GenericPage({ kind, title, text }: { kind: string; title: string; text: string }) { return <><PageHero eyebrow={kind.toUpperCase()} title={title} text={text} /><section className="section"><ServiceCards linkLabel="Enquire" /></section><EnquiryForm source={kind.toLowerCase()} /></> }
