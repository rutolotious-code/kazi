import type { ListingCategory, ListingType } from './types'

export function parsePrice(input: string): number {
  return Number(input.replace(/[^0-9]/g, '')) || 0
}

export function formatPrice(price: number, type: ListingType): string {
  const formatted = `R ${Math.max(0, price).toLocaleString('en-US').replace(/,/g, ' ')}`
  return type === 'Rental' ? `${formatted} / mo` : formatted
}

export function listingLabel(category: ListingCategory, type: ListingType): string {
  return `${category} ${type}`.toUpperCase()
}

export function optimizeImage(url: string, width = 1000): string {
  if (url.includes('/upload/') && url.includes('res.cloudinary.com')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`)
  }
  return url
}
