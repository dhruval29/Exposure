import { useEffect, useState, useRef } from 'react'
import { uploadImagesBatch } from '../lib/uploadImage'
import AuthGate from './AuthGate'
import { supabase } from '../lib/supabaseClient'
import { fetchEvents, createEvent, updateEvent, deleteEvent, fetchAvailableImages, formatDateForInput, formatDateForDisplay } from '../lib/eventManagement'
import styles from './Admin.module.css'

// Premium icon components
const UploadIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,5 17,10" />
    <line x1="12" y1="5" x2="12" y2="15" />
  </svg>
)

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
)

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21,15 16,10 5,21" />
  </svg>
)

const EventIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

function Admin() {
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState('')
  const [progress, setProgress] = useState({ index: 0, total: 0 })
  const [uploaded, setUploaded] = useState([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)
  const [drag, setDrag] = useState(false)
  const inputRef = useRef(null)
  
  // Events management state
  const [events, setEvents] = useState([])
  const [availableImages, setAvailableImages] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    cover_image_id: ''
  })

  // Hide any global scroll indicator overlays while on Admin
  useEffect(() => {
    const selectors = [
      '.scroll-indicator',
      '[data-scroll-indicator]',
      '#scroll-indicator',
      '#scroll',
      '.scroll'
    ]
    const hidden = []
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        hidden.push({ el, display: el.style.display })
        el.style.display = 'none'
      })
    })
    return () => {
      hidden.forEach(({ el, display }) => {
        el.style.display = display
      })
    }
  }, [])

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

  // Load events and available images
  useEffect(() => {
    if (isAdmin) {
      loadEvents()
      loadAvailableImages()
    }
  }, [isAdmin])

  const loadEvents = async () => {
    const { data, error } = await fetchEvents()
    if (error) {
      setStatus(`Error loading events: ${error.message}`)
    } else {
      setEvents(data || [])
    }
  }

  const loadAvailableImages = async () => {
    const { data, error } = await fetchAvailableImages()
    if (error) {
      console.error('Error loading images:', error)
    } else {
      setAvailableImages(data || [])
    }
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()
    if (!eventForm.title || !eventForm.start_date) {
      setStatus('Title and start date are required')
      return
    }

    try {
      if (editingEvent) {
        const { error } = await updateEvent(editingEvent.id, eventForm)
        if (error) throw error
        setStatus('Event updated successfully')
      } else {
        const { error } = await createEvent(eventForm)
        if (error) throw error
        setStatus('Event created successfully')
      }
      
      await loadEvents()
      resetEventForm()
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
  }

  const handleEventEdit = (event) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      description: event.description || '',
      start_date: formatDateForInput(event.start_date),
      end_date: formatDateForInput(event.end_date),
      cover_image_id: event.cover_image?.id || ''
    })
    setShowEventForm(true)
  }

  const handleEventDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const { error } = await deleteEvent(eventId)
      if (error) throw error
      setStatus('Event deleted successfully')
      await loadEvents()
    } catch (err) {
      setStatus(`Error: ${err.message}`)
    }
  }

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      start_date: '',
      end_date: '',
      cover_image_id: ''
    })
    setEditingEvent(null)
    setShowEventForm(false)
  }

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDrag(false)
    const list = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
    if (list.length) setFiles(prev => [...prev, ...list])
  }

  const onBrowse = (e) => {
    const list = Array.from(e.target.files || [])
    if (list.length) setFiles(prev => [...prev, ...list])
  }

  const removeAt = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx))
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
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <h1 className={styles.title}>Media Management</h1>
              <p className={styles.subtitle}>Upload and organize gallery images with precision</p>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeText}>Administrative Access</span>
            </div>
          </header>

          {checking ? (
            <div className={styles.statusCard}>
              <div className={styles.statusIcon}>
                <div className={styles.spinner} />
              </div>
              <p className={styles.statusText}>Verifying permissions</p>
            </div>
          ) : !isAdmin ? (
            <div className={styles.statusCard}>
              <div className={styles.statusIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <p className={styles.statusText}>Administrative privileges required</p>
              <p className={styles.statusSubtext}>Contact the site administrator to request access</p>
            </div>
          ) : (
            <main className={styles.main}>
              <section
                className={`${styles.uploadZone} ${drag ? styles.uploadZoneDrag : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={onDrop}
              >
                <div className={styles.uploadIcon}>
                  <UploadIcon />
                </div>
                <h3 className={styles.uploadTitle}>Drop images to upload</h3>
                <p className={styles.uploadSubtitle}>or select files manually</p>
                
                <div className={styles.uploadActions}>
                  <button 
                    className={styles.buttonSecondary} 
                    onClick={() => inputRef.current?.click()}
                    type="button"
                  >
                    <FolderIcon />
                    <span>Browse Files</span>
                  </button>
                  <button 
                    className={styles.buttonPrimary} 
                    disabled={!files.length} 
                    onClick={onSubmit}
                    type="button"
                  >
                    <UploadIcon />
                    <span>Upload{files.length ? ` ${files.length} ${files.length === 1 ? 'Image' : 'Images'}` : ''}</span>
                  </button>
                </div>
                
                <input 
                  ref={inputRef} 
                  type="file" 
                  accept="image/*" 
                  multiple 
                  onChange={onBrowse} 
                  className={styles.hiddenInput}
                />
                
                {progress.total > 0 && (
                  <div className={styles.progressSection}>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill} 
                        style={{ width: `${pct}%` }} 
                      />
                    </div>
                    <div className={styles.progressText}>
                      <span>{progress.index} of {progress.total} uploaded</span>
                      <span className={styles.progressPercent}>{pct}%</span>
                    </div>
                  </div>
                )}
              </section>

              {status && (
                <div className={`${styles.statusMessage} ${status.includes('success') ? styles.statusSuccess : styles.statusInfo}`}>
                  {status.includes('success') && <CheckIcon />}
                  <span>{status}</span>
                </div>
              )}

              {files.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <ImageIcon />
                    <span>Pending Upload</span>
                    <span className={styles.count}>{files.length}</span>
                  </h2>
                  <div className={styles.imageGrid}>
                    {files.map((f, i) => (
                      <div key={`${f.name}-${i}`} className={styles.imageCard}>
                        <button 
                          className={styles.removeButton} 
                          title="Remove image" 
                          onClick={() => removeAt(i)}
                          type="button"
                        >
                          <CloseIcon />
                        </button>
                        <div className={styles.imageWrapper}>
                          <img src={URL.createObjectURL(f)} alt={f.name} />
                        </div>
                        <div className={styles.imageInfo}>
                          <span className={styles.imageName}>{f.name}</span>
                          <span className={styles.imageSize}>
                            {(f.size / 1024 / 1024).toFixed(1)} MB
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {uploaded.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <CheckIcon />
                    <span>Successfully Uploaded</span>
                    <span className={styles.count}>{uploaded.length}</span>
                  </h2>
                  <div className={styles.imageGrid}>
                    {uploaded.map((row) => (
                      <div key={row.id} className={styles.imageCard}>
                        <div className={styles.imageWrapper}>
                          <img src={row.public_url} alt={row.title || 'Uploaded image'} />
                        </div>
                        <div className={styles.imageInfo}>
                          <span className={styles.imageName}>
                            {row.title || 'Untitled'}
                          </span>
                          <span className={styles.imageStatus}>Live</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Events Management Section */}
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <EventIcon />
                    <span>Events Management</span>
                    <span className={styles.count}>{events.length}</span>
                  </h2>
                  <button 
                    className={styles.buttonPrimary}
                    onClick={() => setShowEventForm(true)}
                    type="button"
                  >
                    <PlusIcon />
                    <span>Add Event</span>
                  </button>
                </div>

                {events.length > 0 ? (
                  <div className={styles.eventsGrid}>
                    {events.map((event) => (
                      <div key={event.id} className={styles.eventCard}>
                        <div className={styles.eventImage}>
                          {event.cover_image ? (
                            <img src={event.cover_image.public_url} alt={event.title} />
                          ) : (
                            <div className={styles.eventPlaceholder}>
                              <EventIcon />
                            </div>
                          )}
                        </div>
                        <div className={styles.eventInfo}>
                          <h3 className={styles.eventTitle}>{event.title}</h3>
                          {event.description && (
                            <p className={styles.eventDescription}>{event.description}</p>
                          )}
                          <div className={styles.eventDates}>
                            <span className={styles.eventDate}>
                              {formatDateForDisplay(event.start_date)}
                              {event.end_date && ` - ${formatDateForDisplay(event.end_date)}`}
                            </span>
                          </div>
                          <div className={styles.eventActions}>
                            <button 
                              className={styles.buttonSecondary}
                              onClick={() => handleEventEdit(event)}
                              type="button"
                            >
                              <EditIcon />
                              <span>Edit</span>
                            </button>
                            <button 
                              className={styles.buttonDanger}
                              onClick={() => handleEventDelete(event.id)}
                              type="button"
                            >
                              <CloseIcon />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <EventIcon />
                    <p>No events yet. Create your first event!</p>
                  </div>
                )}
              </section>

              {/* Event Form Modal */}
              {showEventForm && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>{editingEvent ? 'Edit Event' : 'Create New Event'}</h3>
                      <button 
                        className={styles.closeButton}
                        onClick={resetEventForm}
                        type="button"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    <form onSubmit={handleEventSubmit} className={styles.eventForm}>
                      <div className={styles.formGroup}>
                        <label htmlFor="eventTitle">Title *</label>
                        <input
                          id="eventTitle"
                          type="text"
                          value={eventForm.title}
                          onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="eventDescription">Description</label>
                        <textarea
                          id="eventDescription"
                          value={eventForm.description}
                          onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                          rows="3"
                        />
                      </div>
                      
                      <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                          <label htmlFor="eventStartDate">Start Date *</label>
                          <input
                            id="eventStartDate"
                            type="date"
                            value={eventForm.start_date}
                            onChange={(e) => setEventForm(prev => ({ ...prev, start_date: e.target.value }))}
                            required
                          />
                        </div>
                        
                        <div className={styles.formGroup}>
                          <label htmlFor="eventEndDate">End Date</label>
                          <input
                            id="eventEndDate"
                            type="date"
                            value={eventForm.end_date}
                            onChange={(e) => setEventForm(prev => ({ ...prev, end_date: e.target.value }))}
                          />
                        </div>
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="eventCoverImage">Cover Image</label>
                        <select
                          id="eventCoverImage"
                          value={eventForm.cover_image_id}
                          onChange={(e) => setEventForm(prev => ({ ...prev, cover_image_id: e.target.value }))}
                        >
                          <option value="">Select an image</option>
                          {availableImages.map((image) => (
                            <option key={image.id} value={image.id}>
                              {image.title || 'Untitled'}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className={styles.formActions}>
                        <button 
                          type="button" 
                          className={styles.buttonSecondary}
                          onClick={resetEventForm}
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className={styles.buttonPrimary}
                        >
                          {editingEvent ? 'Update Event' : 'Create Event'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </main>
          )}
        </div>
      </div>
    </AuthGate>
  )
}

export default Admin


