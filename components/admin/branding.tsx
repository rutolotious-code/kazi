'use client'

import Image from 'next/image'
import { useState } from 'react'
import { deleteField, doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { useBranding } from '@/hooks/use-branding'

export function Branding() {
  const branding = useBranding()
  const [uploading, setUploading] = useState<'logoUrl' | 'heroBgUrl' | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const upload = async (field: 'logoUrl' | 'heroBgUrl', file?: File) => {
    if (!file) return
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setMessage('Choose a PNG, JPG or WebP image under 5 MB.')
      return
    }
    setUploading(field)
    setMessage(null)
    try {
      const url = await uploadToCloudinary(file, 'branding')
      await setDoc(doc(db, 'siteSettings', 'branding'), { [field]: url, updatedAt: serverTimestamp() }, { merge: true })
      setMessage('Branding updated successfully.')
    } catch (error) {
      console.error('Unable to update branding:', error)
      setMessage('The upload could not be completed. Please try again.')
    } finally {
      setUploading(null)
    }
  }
  const reset = async (field: 'logoUrl' | 'heroBgUrl') => {
    try {
      await setDoc(doc(db, 'siteSettings', 'branding'), { [field]: deleteField(), updatedAt: serverTimestamp() }, { merge: true })
      setMessage('Default image restored.')
    } catch (error) {
      console.error('Unable to reset branding:', error)
      setMessage('The default image could not be restored.')
    }
  }
  return <div className="admin-stack">
    {message && <p className="form-message">{message}</p>}
    <BrandCard title="Logo" image={branding.logoUrl} field="logoUrl" uploading={uploading === 'logoUrl'} onUpload={upload} onReset={reset} />
    <BrandCard title="Home background image" image={branding.heroBgUrl} field="heroBgUrl" uploading={uploading === 'heroBgUrl'} onUpload={upload} onReset={reset} />
  </div>
}

function BrandCard({ title, image, field, uploading, onUpload, onReset }: { title: string; image: string; field: 'logoUrl' | 'heroBgUrl'; uploading: boolean; onUpload: (field: 'logoUrl' | 'heroBgUrl', file?: File) => void; onReset: (field: 'logoUrl' | 'heroBgUrl') => void }) {
  return <article className="admin-card">
    <div><span className="eyebrow">BRANDING</span><h2>{title}</h2></div>
    <Image className="branding-preview" src={image} alt={`${title} preview`} width={field === 'logoUrl' ? 180 : 480} height={field === 'logoUrl' ? 120 : 220} unoptimized />
    <div className="admin-actions"><label className="button dark">{uploading ? 'Uploading…' : 'Choose image'}<input type="file" accept="image/png,image/jpeg,image/webp" hidden disabled={uploading} onChange={(event) => onUpload(field, event.target.files?.[0])} /></label><button className="button outline" type="button" onClick={() => onReset(field)}>Reset to default</button></div>
  </article>
}
