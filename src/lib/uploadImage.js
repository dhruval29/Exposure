import { supabase } from './supabaseClient'

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

  const { data, error: insErr } = await supabase
    .from('images')
    .insert({
      storage_path: path,
      public_url: publicUrl,
      title: title || file.name,
      is_public: isPublic,
      uploaded_by: userId,
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
