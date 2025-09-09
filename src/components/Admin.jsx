import { useEffect, useState, useRef } from 'react'
import { uploadImagesBatch } from '../lib/uploadImage'
import AuthGate from './AuthGate'
import { supabase } from '../lib/supabaseClient'
import styles from './Admin.module.css'

function Admin() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState({ index: 0, total: 0 })
  const [uploaded, setUploaded] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    let mounted = true

    const checkAdmin = async () => {
      const { data } = await supabase.auth.getUser()
      const uid = data?.user?.id
      if (!uid) {
        if (mounted) { setIsAdmin(false); setChecking(false) }
        return
      }
      const { data: isAdminResp } = await supabase.rpc('is_admin', { uid })
      if (mounted) { setIsAdmin(Boolean(isAdminResp)); setChecking(false) }
    }

    checkAdmin()

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      setChecking(true)
      checkAdmin()
    })

    return () => { mounted = false; sub.subscription.unsubscribe() }
  }, [])

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDrag(false)
    const list = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
    if (list.length) setFiles(prev => [...prev, ...list])
  }

  const onBrowse = (e) => {
    const list = Array.from(e.target.files || [])
    if (list.length) setFiles(prev => [...prev, ...list])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!files.length) return
    setStatus('Uploading...')
    setUploaded([])
    setProgress({ index: 0, total: files.length })
    try {
      const rows = await uploadImagesBatch(files, { isPublic: true }, ({ index, total }) => setProgress({ index, total }))
      setUploaded(rows)
      setStatus('Uploaded successfully')
      setFiles([])
    } catch (err) {
      setStatus(err.message)
    }
  }

  const pct = progress.total ? Math.round((progress.index / progress.total) * 100) : 0

  return (
    <AuthGate>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <div className={styles.title}>Admin Upload</div>
          <div className={styles.meta}>
            <span style={{ opacity: .7 }}>Admin only</span>
          </div>
        </div>

        {checking ? (
          <p>Checking permissions…</p>
        ) : !isAdmin ? (
          <p>You are signed in but not an admin. Contact the site owner to get access.</p>
        ) : (
          <>
            <div
              className={`${styles.dropzone} ${drag ? styles.drag : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
              onDragLeave={() => setDrag(false)}
              onDrop={onDrop}
            >
              <p>Drag & drop images here</p>
              <div className={styles.controls}>
                <button className={styles.button} onClick={() => inputRef.current?.click()}>Browse files</button>
                <button className={styles.button} disabled={!files.length} onClick={onSubmit}>Upload {files.length ? `(${files.length})` : ''}</button>
              </div>
              <input ref={inputRef} type="file" accept="image/*" multiple onChange={onBrowse} hidden />
              {progress.total > 0 && (
                <div className={styles.progressWrap}>
                  <div className={styles.progressBar}>
                    <div className={styles.progressInner} style={{ width: `${pct}%` }} />
                  </div>
                  <div className={styles.note}>Progress: {progress.index}/{progress.total} ({pct}%)</div>
                </div>
              )}
            </div>

            {status && <p className={styles.note}>{status}</p>}

            {files.length > 0 && (
              <div className={styles.grid}>
                {files.map((f, i) => (
                  <div key={`${f.name}-${i}`} className={styles.card}>
                    <img src={URL.createObjectURL(f)} alt={f.name} />
                    <div className={styles.cardTitle}>{f.name}</div>
                  </div>
                ))}
              </div>
            )}

            {uploaded.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <div className={styles.title} style={{ fontSize: 18 }}>Uploaded</div>
                <div className={styles.grid}>
                  {uploaded.map((row) => (
                    <div key={row.id} className={styles.card}>
                      <img src={row.public_url} alt={row.title || 'image'} />
                      <div className={styles.cardTitle}>{row.title || row.public_url}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AuthGate>
  )
}

export default Admin


