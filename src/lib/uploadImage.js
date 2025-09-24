import { supabase } from './supabaseClient'
import exifr from 'exifr'

export async function uploadImage(file, { title, isPublic = true } = {}) {
  if (!file) throw new Error('No file provided')

  const { data: auth } = await supabase.auth.getUser()
  const userId = auth?.user?.id || null
  const userEmail = auth?.user?.email || ''

  // Ensure a profile row exists to satisfy FK (images.uploaded_by -> users.id)
  if (userId) {
    const username = userEmail ? userEmail.split('@')[0] : null
    await supabase
      .from('users')
      .upsert({ id: userId, username: username || userId, display_name: username || 'User' }, { onConflict: 'id' })
  }

  const extension = (file.name.split('.').pop() || 'jpg').toLowerCase()
  const datePrefix = new Date().toISOString().slice(0, 10)
  const path = `uploads/${datePrefix}/${crypto.randomUUID()}.${extension}`

  const { error: upErr } = await supabase.storage
    .from('images')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || 'application/octet-stream',
    })
  if (upErr) throw upErr

  const { data: pub } = supabase.storage.from('images').getPublicUrl(path)
  const publicUrl = pub?.publicUrl

  // Extract EXIF (best-effort)
  let exif = null
  try {
    exif = await exifr.parse(file, { tiff: true, ifd0: true, exif: true, iptc: true })
  } catch {}

  // Normalize a few fields
  const toNumber = (v) => (typeof v === 'number' ? v : (v && v.numerator && v.denominator ? v.numerator / v.denominator : null))
  const aperture_fnumber = toNumber(exif?.FNumber) || toNumber(exif?.ApertureValue) || null
  const focal_length_mm = toNumber(exif?.FocalLength) || null
  const iso = (exif?.ISO && Number(exif.ISO)) || null
  const camera_make = exif?.Make || null
  const camera_model = exif?.Model || null
  const lens_model = exif?.LensModel || null
  const taken_at = exif?.DateTimeOriginal ? new Date(exif.DateTimeOriginal).toISOString() : null
  // Shutter speed as pretty fraction if possible
  let shutter_speed = null
  if (exif?.ExposureTime) {
    const v = toNumber(exif.ExposureTime)
    if (v && v > 0) {
      shutter_speed = v >= 1 ? `${v.toFixed(1)}s` : `1/${Math.round(1 / v)}`
    }
  } else if (exif?.ShutterSpeedValue) {
    const v = toNumber(exif.ShutterSpeedValue)
    if (v) shutter_speed = `${v.toFixed(2)}s`
  }

  const { data, error: insErr } = await supabase
    .from('images')
    .insert({
      storage_path: path,
      public_url: publicUrl,
      title: title || file.name,
      is_public: isPublic,
      uploaded_by: userId,
      exif_json: exif ? JSON.stringify(exif) : null,
      camera_make,
      camera_model,
      lens_model,
      focal_length_mm,
      aperture_fnumber,
      shutter_speed,
      iso,
      taken_at
    })
    .select()
    .single()

  if (insErr) throw insErr
  return data
}

export async function uploadImagesBatch(files, { isPublic = true } = {}, onProgress) {
  const results = []
  for (let i = 0; i < files.length; i += 1) {
    const file = files[i]
    const row = await uploadImage(file, { title: file.name, isPublic })
    results.push(row)
    if (typeof onProgress === 'function') onProgress({ index: i + 1, total: files.length })
  }
  return results
}
