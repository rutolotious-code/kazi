import { Shell } from '@/components/site'
import { EnquiryForm } from '@/components/public-pages'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Consulting | NQ Kazi Investments', description: 'Independent real estate consulting for serious buyers, families and SMMEs.' }
import { BriefcaseBusiness, Compass, LineChart, ShieldCheck } from 'lucide-react'

const services = [
  [Compass, 'Strategy', 'Define a clear property strategy aligned to your financial goals.'],
  [LineChart, 'Market intelligence', 'Data-led insights on suburbs, sectors and yield.'],
  [BriefcaseBusiness, 'Portfolio review', 'Independent review of existing holdings and performance.'],
  [ShieldCheck, 'Risk management', 'Identify tenant, structural and regulatory risk early.'],
] as const

export default function Page() {
  return (
    <Shell>
      <section className="page-hero olive-section">
        <div className="section-heading">
          <span className="eyebrow">CONSULTING</span>
          <h1>Property advisory that compounds.</h1>
          <p>Independent, investor-grade real estate consulting for serious buyers, families and SMMEs across South Africa.</p>
        </div>
      </section>
      <section className="section">
        <div className="cards">{services.map(([Icon, title, text]) => <article className="card" key={title}><div className="icon-box red-icon"><Icon /></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="off-white"><EnquiryForm source="consulting" title="Book a consultation" subtitle="Share your goals and we'll respond with next steps." /></section>
    </Shell>
  )
}
