import { useState } from 'react'

function Admin() {
  const [token, setToken] = useState('')
  const [file, setFile] = useState(null)
  const [title, setTitle] = useState('')
  const [alt, setAlt] = useState('')
  const [status, setStatus] = useState('')
  const [uploadedUrl, setUploadedUrl] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('Uploading...')
    try {
      const form = new FormData()
      if (file) form.append('file', file)
      if (title) form.append('title', title)
      if (alt) form.append('alt', alt)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setUploadedUrl(data.url)
      setStatus('Uploaded successfully')
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <div style={{ maxWidth: 520, margin: '80px auto', padding: 16 }}>
      <h2>Admin Upload</h2>
      <form onSubmit={onSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Admin Token</label>
          <input type="password" value={token} onChange={e => setToken(e.target.value)} style={{ width: '100%' }} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Image File</label>
          <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} required />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Title (optional)</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Alt (optional)</label>
          <input type="text" value={alt} onChange={e => setAlt(e.target.value)} style={{ width: '100%' }} />
        </div>
        <button type="submit">Upload</button>
      </form>
      {status && <p style={{ marginTop: 12 }}>{status}</p>}
      {uploadedUrl && (
        <div style={{ marginTop: 12 }}>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">View Uploaded Image</a>
        </div>
      )}
    </div>
  )
}

export default Admin


