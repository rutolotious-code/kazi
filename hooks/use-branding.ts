'use client'

import { useEffect, useState } from 'react'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Branding } from '@/lib/types'

const defaultBranding: Required<Branding> = {
  logoUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/kazi-SOuITb1DNzpkp3UlG3KClr8mOxvz7K.png',
  heroBgUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lady-JJ1g2896rrLw7bZLJuB4ZTA9OXcE9Z.png',
  aboutImageUrl: '',
}

export function useBranding(): Required<Branding> {
  const [branding, setBranding] = useState(defaultBranding)
  useEffect(() => onSnapshot(doc(db, 'siteSettings', 'branding'), (snapshot) => {
    const data = snapshot.exists() ? snapshot.data() : {}
    setBranding({ logoUrl: data.logoUrl || defaultBranding.logoUrl, heroBgUrl: data.heroBgUrl || defaultBranding.heroBgUrl, aboutImageUrl: data.aboutImageUrl || defaultBranding.aboutImageUrl })
  }, (error) => console.error('Unable to load branding:', error)), [])
  return branding
}
