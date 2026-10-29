import { Shell } from '@/components/site'
import { EnquiryForm } from '@/components/public-pages'

const included = [
  'Comparable market analysis (CMA)',
  'Area trend and demand assessment',
  'Rental yield and ROI projections',
  'Condition and improvement recommendations',
  'Written valuation report',
]

export default function Page() {
  return (
    <Shell>
      <section className="page-hero olive-section">
        <div className="section-heading">
          <span className="eyebrow">PROPERTY EVALUATION</span>
          <h1>Know exactly what your property is worth.</h1>
          <p>We deliver clear, market-backed property valuations so you can buy, sell or invest with confidence.</p>
        </div>
      </section>
      <section className="section split evaluation-content">
        <div>
          <span className="eyebrow">WHAT&apos;S INCLUDED</span>
          <h2>A valuation grounded in the market.</h2>
          <ul className="checks">{included.map((item) => <li key={item}>{item}</li>)}</ul>
          <p className="muted">Evaluations available for residential, commercial and industrial property nationwide.</p>
        </div>
        <EnquiryForm source="evaluation" title="Request an evaluation" subtitle="Tell us about the property and we'll be in touch." />
      </section>
    </Shell>
  )
}
