'use client'

import { useMemo, useState } from 'react'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { useAuth } from '@/components/auth-provider'
import { db } from '@/lib/firebase'
import { formatPrice, listingLabel, parsePrice } from '@/lib/format'
import { uploadToCloudinary } from '@/lib/cloudinary'
import type { ListingCategory, ListingType } from '@/lib/types'

type FileItem = { id: string; file: File; preview: string; status: 'ready' | 'uploading' | 'done' | 'failed'; url?: string; error?: string }

const categories: ListingCategory[] = ['Residential', 'Commercial', 'Industrial']
const types: ListingType[] = ['Sale', 'Rental']

export function ListingForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user, isAdmin } = useAuth()
  const [category, setCategory] = useState<ListingCategory>('Residential')
  const [type, setType] = useState<ListingType>('Sale')
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [priceInput, setPriceInput] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<FileItem[]>([])
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const price = parsePrice(priceInput)
  const showRooms = category === 'Residential'
  const pricePreview = useMemo(() => formatPrice(price, type), [price, type])

  function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    const valid = selected.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type) && file.size <= 5 * 1024 * 1024)
    if (valid.length !== selected.length) setMessage({ type: 'error', text: 'Images must be JPG, PNG, or WebP files no larger than 5 MB each.' })
    const newItems = valid.map((file) => ({ id: `${file.name}-${file.lastModified}-${Math.random()}`, file, preview: URL.createObjectURL(file), status: 'ready' as const }))
    setFiles((current) => [...current, ...newItems].slice(0, 6))
    event.target.value = ''
  }

  function removeFile(id: string) {
    setFiles((current) => { const item = current.find((entry) => entry.id === id); if (item) URL.revokeObjectURL(item.preview); return current.filter((entry) => entry.id !== id) })
  }

  async function uploadFile(item: FileItem) {
    setFiles((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'uploading', error: undefined } : entry))
    try {
      const url = await uploadToCloudinary(item.file, 'kazi/listings')
      setFiles((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'done', url } : entry))
      return url
    } catch (error) {
      console.error('Cloudinary upload failed:', error)
      setFiles((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: 'failed', error: 'Upload failed' } : entry))
      return null
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage(null)
    if (!user) return setMessage({ type: 'error', text: 'Please sign in before submitting a listing.' })
    if (!title.trim() || !location.trim() || !price || price <= 0) return setMessage({ type: 'error', text: 'Please complete the property name, location, and a price greater than zero.' })
    if (!files.length) return setMessage({ type: 'error', text: 'Please add at least one property image.' })
    if (files.some((item) => item.status === 'uploading')) return setMessage({ type: 'error', text: 'Please wait for image uploads to finish.' })

    setSaving(true)
    try {
      const urls = (await Promise.all(files.map((item) => item.status === 'done' && item.url ? item.url : uploadFile(item)))).filter((url): url is string => Boolean(url))
      if (urls.length !== files.length) throw new Error('One or more images could not be uploaded.')
      await addDoc(collection(db, 'listings'), {
        category, type, title: title.trim(), location: location.trim(), price,
        bedrooms: showRooms && bedrooms ? Number(bedrooms) : null,
        bathrooms: showRooms && bathrooms ? Number(bathrooms) : null,
        description: description.trim(), images: urls, coverImage: urls[0], ownerUid: user.uid,
        ownerName: user.displayName || user.email?.split('@')[0] || 'User', ownerEmail: user.email || '',
        createdAt: serverTimestamp(), status: isAdmin ? 'approved' : 'pending',
      })
      setTitle(''); setLocation(''); setPriceInput(''); setBedrooms(''); setBathrooms(''); setDescription('')
      files.forEach((item) => URL.revokeObjectURL(item.preview)); setFiles([])
      setMessage({ type: 'success', text: isAdmin ? 'Listing published successfully.' : 'Thanks! Your listing was submitted and is waiting for admin approval.' })
      onSuccess?.()
    } catch (error) {
      console.error('Could not save listing:', error)
      setMessage({ type: 'error', text: error instanceof Error && error.message.includes('uploaded') ? error.message : 'Could not save the listing. Please try again.' })
    } finally { setSaving(false) }
  }

  return <form className="listing-form" onSubmit={handleSubmit}>
    <div className="form-grid">
      <label>Category<select value={category} onChange={(event) => setCategory(event.target.value as ListingCategory)}>{categories.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Type<select value={type} onChange={(event) => setType(event.target.value as ListingType)}>{types.map((value) => <option key={value}>{value}</option>)}</select></label>
      <label>Property name<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Sandhurst Modern Villa" /></label>
      <label>Location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Sandton, Johannesburg" /></label>
      <label>Price<input value={priceInput} onChange={(event) => setPriceInput(event.target.value)} placeholder="R850000" /><small>Preview: {pricePreview}</small></label>
      {showRooms && <><label>Bedrooms<input type="number" min="0" value={bedrooms} onChange={(event) => setBedrooms(event.target.value)} /></label><label>Bathrooms<input type="number" min="0" value={bathrooms} onChange={(event) => setBathrooms(event.target.value)} /></label></>}
    </div>
    <label>Short description<textarea value={description} onChange={(event) => setDescription(event.target.value)} rows={4} /></label>
    <div className="listing-label-preview"><span className="eyebrow">{listingLabel(category, type)}</span><strong>{title || 'Your property name'}</strong></div>
    <label>Images <small>1 to 6 files, JPG, PNG, or WebP, max 5 MB each. The first image is the cover.</small><input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={addFiles} /></label>
    {files.length > 0 && <div className="upload-previews">{files.map((item, index) => <div className="upload-preview" key={item.id}><img src={item.preview} alt={`Property preview ${index + 1}`} /><div><strong>{index === 0 ? 'Cover image' : `Image ${index + 1}`}</strong><span>{item.status === 'uploading' ? 'Uploading…' : item.status === 'done' ? 'Done' : item.status === 'failed' ? 'Failed' : 'Ready'}</span>{item.status === 'failed' && <button type="button" onClick={() => uploadFile(item)}>Retry</button>}<button type="button" onClick={() => removeFile(item.id)}>Remove</button></div></div>)}</div>}
    {message && <p className={message.type === 'error' ? 'form-error' : 'form-success'} role="alert">{message.text}</p>}
    <button className="button red" type="submit" disabled={saving}>{saving ? 'Saving…' : 'Submit listing'}</button>
  </form>
}
