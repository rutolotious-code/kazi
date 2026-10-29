import { Shell } from '@/components/site'
import { EnquiryForm } from '@/components/public-pages'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact | NQ Kazi Investments', description: 'Talk to NQ Kazi Investments about your property goals.' }

const details = [
  ['PHONE', '083 422 4505', 'tel:+27834224505'],
  ['WHATSAPP', 'Chat with us', 'https://wa.me/27834224505'],
  ['EMAIL', 'ntsaphoquwe@gmail.com', 'mailto:ntsaphoquwe@gmail.com'],
]

export default function Page() {
  return (
    <Shell>
      <section className="page-hero olive-section"><div className="section-heading"><span className="eyebrow">CONTACT</span><h1>Let&apos;s talk property.</h1><p>Our team responds personally to every enquiry — usually within one business day.</p></div></section>
      <section className="section">
        <div className="cards contact-details">{details.map(([label, value, href]) => <a className="card contact-detail" href={href} key={label}><span className="eyebrow">{label}</span><strong>{value}</strong></a>)}<div className="card contact-detail"><span className="eyebrow">COVERAGE</span><strong>National · South Africa</strong></div></div>
        <div className="office-hours"><span className="eyebrow">OFFICE HOURS</span><strong>Mon – Fri · 08:00 – 17:30</strong><strong>Sat · 09:00 – 13:00</strong></div>
      </section>
      <EnquiryForm source="contact" title="Send us a message" subtitle="We'll be in touch as soon as possible." />
    </Shell>
  )
}
