export type ListingCategory = 'Residential' | 'Commercial' | 'Industrial'
export type ListingType = 'Sale' | 'Rental'
export type ListingStatus = 'pending' | 'approved' | 'rejected'

export type Listing = {
  id: string
  category: ListingCategory
  type: ListingType
  title: string
  location: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  description: string
  images: string[]
  coverImage: string
  status: ListingStatus
  ownerUid: string
  ownerName: string
  ownerEmail: string
  createdAt: unknown
  approvedAt?: unknown
  approvedBy?: string
}

export type Branding = { logoUrl?: string; heroBgUrl?: string; aboutImageUrl?: string }
