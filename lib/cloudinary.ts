export async function uploadToCloudinary(file: File, folder = 'kazi') {
  const fd = new FormData()
  fd.append('file', file)
  fd.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'kazi_qa')
  fd.append('folder', folder)
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'zeuawlmv'
  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: fd })
  if (!res.ok) throw new Error('Upload failed')
  return (await res.json()).secure_url as string
}
