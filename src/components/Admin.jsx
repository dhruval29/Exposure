import { useEffect, useState, useRef } from 'react'
import { uploadImagesBatch } from '../lib/uploadImage'
import AuthGate from './AuthGate'
import { supabase } from '../lib/supabaseClient'
// Removed date formatting imports - using month_year format instead
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

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
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
  const [searchQuery, setSearchQuery] = useState('')
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    month_year: '',
    cover_image_id: '',
    linksText: ''
  })
  
  // Image upload state for event creation
  const [eventImageFile, setEventImageFile] = useState(null)
  const [eventImagePreview, setEventImagePreview] = useState('')
  const [uploadingEventImage, setUploadingEventImage] = useState(false)
  const eventImageInputRef = useRef(null)

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

    const checkAdmin = async (force = false) => {
      // Reuse cached result within the session unless force-checking
      const cached = sessionStorage.getItem('ee_admin_check')
      if (!force && cached) {
        const parsed = JSON.parse(cached)
        if (mounted) {
          setIsAdmin(Boolean(parsed.isAdmin))
          setChecking(false)
        }
        return
      }

      const { data } = await supabase.auth.getUser()
      const uid = data?.user?.id
      if (!uid) {
        if (mounted) { setIsAdmin(false); setChecking(false) }
        return
      }
      const { data: isAdminResp } = await supabase.rpc('is_admin', { uid })
      const result = Boolean(isAdminResp)
      sessionStorage.setItem('ee_admin_check', JSON.stringify({ isAdmin: result }))
      if (mounted) { setIsAdmin(result); setChecking(false) }
    }

    // Initial check (will use cache if present)
    checkAdmin(false)

    // Only re-check on explicit auth state changes (e.g., sign-in/out), clear cache then force check
    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      sessionStorage.removeItem('ee_admin_check')
      setChecking(true)
      checkAdmin(true)
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
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          id,
          title,
          description,
          month_year,
          created_at,
          cover_image_id,
          links
        `)
        .order('created_at', { ascending: false });

      if (error) {
        setStatus(`Error loading events: ${error.message}`)
      } else {
        // Fetch cover images separately to avoid relationship conflicts
        const eventsWithImages = await Promise.all(
          (data || []).map(async (event) => {
            if (event.cover_image_id) {
              const { data: image } = await supabase
                .from('images')
                .select('id, public_url, title')
                .eq('id', event.cover_image_id)
                .single();
              return { ...event, cover_image: image };
            }
            return { ...event, cover_image: null };
          })
        );
        setEvents(eventsWithImages);
      }
    } catch (err) {
      setStatus(`Error loading events: ${err.message}`)
    }
  }

  const loadAvailableImages = async () => {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('id, public_url, title')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading images:', error)
      } else {
        setAvailableImages(data || [])
      }
    } catch (err) {
      console.error('Error loading images:', err)
    }
  }

  const handleEventSubmit = async (e) => {
    e.preventDefault()
    if (!eventForm.title || !eventForm.month_year) {
      setStatus('Title and month/year are required')
      return
    }

    try {
      if (editingEvent) {
        const { error } = await supabase
          .from('events')
          .update({
            title: eventForm.title,
            description: eventForm.description,
            month_year: eventForm.month_year,
            cover_image_id: eventForm.cover_image_id || null,
            links: (() => {
              const parts = String(eventForm.linksText || '')
                .split(/\s|,|\|/)
                .map(s => s.trim())
                .filter(Boolean)
                .slice(0, 3)
              return parts.length ? parts : null
            })()
          })
          .eq('id', editingEvent.id)
        
        if (error) throw error
        setStatus('Event updated successfully')
      } else {
        const { error } = await supabase
          .from('events')
          .insert({
            title: eventForm.title,
            description: eventForm.description,
            month_year: eventForm.month_year,
            cover_image_id: eventForm.cover_image_id || null,
            is_public: true,
            links: (() => {
              const parts = String(eventForm.linksText || '')
                .split(/\s|,|\|/)
                .map(s => s.trim())
                .filter(Boolean)
                .slice(0, 3)
              return parts.length ? parts : null
            })()
          })
        
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
      month_year: event.month_year || '',
      cover_image_id: event.cover_image?.id || '',
      linksText: Array.isArray(event.links) && event.links.length ? event.links.join('\n') : ''
    })
    setShowEventForm(true)
  }

  const handleEventDelete = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return
    
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
      
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
      month_year: '',
      cover_image_id: '',
      linksText: ''
    })
    setEditingEvent(null)
    setShowEventForm(false)
    // Clear image upload state
    setEventImageFile(null)
    setEventImagePreview('')
    setUploadingEventImage(false)
  }

  // Handle event image file selection
  const handleEventImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setEventImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setEventImagePreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload event image and set it as selected
  const handleEventImageUpload = async () => {
    if (!eventImageFile) return

    setUploadingEventImage(true)
    try {
      const uploadedImages = await uploadImagesBatch([eventImageFile], { isPublic: true })
      if (uploadedImages && uploadedImages.length > 0) {
        const uploadedImage = uploadedImages[0]
        // Add to available images
        setAvailableImages(prev => [uploadedImage, ...prev])
        // Select the newly uploaded image
        setEventForm(prev => ({ ...prev, cover_image_id: uploadedImage.id }))
        // Clear upload state
        setEventImageFile(null)
        setEventImagePreview('')
        setStatus('Image uploaded successfully!')
      }
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`)
    } finally {
      setUploadingEventImage(false)
    }
  }

  // Remove selected event image
  const handleEventImageRemove = () => {
    setEventImageFile(null)
    setEventImagePreview('')
    if (eventImageInputRef.current) {
      eventImageInputRef.current.value = ''
    }
  }

  // Filter events based on search query
  const filteredEvents = events.filter(event => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const title = (event.title || '').toLowerCase()
    const description = (event.description || '').toLowerCase()
    const monthYear = (event.month_year || '').toLowerCase()
    
    return title.includes(query) || 
           description.includes(query) || 
           monthYear.includes(query)
  })

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
                    <span className={styles.count}>
                      {searchQuery ? `${filteredEvents.length}/${events.length}` : events.length}
                    </span>
                  </h2>
                  <div className={styles.sectionActions}>
                    <div className={styles.searchContainer}>
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                    <button 
                      className={styles.buttonPrimary}
                      onClick={() => setShowEventForm(true)}
                      type="button"
                    >
                      <PlusIcon />
                      <span>Add Event</span>
                    </button>
                  </div>
                </div>

                {filteredEvents.length > 0 ? (
                  <div className={styles.eventsGrid}>
                    {filteredEvents.map((event) => (
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
                              {event.month_year}
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
                    <p>
                      {searchQuery 
                        ? `No events found matching "${searchQuery}"`
                        : 'No events yet. Create your first event!'
                      }
                    </p>
                    {searchQuery && (
                      <button 
                        className={styles.buttonSecondary}
                        onClick={() => setSearchQuery('')}
                        type="button"
                      >
                        Clear search
                      </button>
                    )}
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
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="eventMonthYear">Month & Year * (e.g., "Dec 24", "Jan 25")</label>
                        <input
                          id="eventMonthYear"
                          type="text"
                          placeholder="Dec 24"
                          value={eventForm.month_year}
                          onChange={(e) => setEventForm(prev => ({ ...prev, month_year: e.target.value }))}
                          required
                        />
                      </div>
                      
                      <div className={styles.formGroup}>
                        <label htmlFor="eventCoverImage">Cover Image</label>
                        <div className={styles.coverImageSection}>
                          <select
                            id="eventCoverImage"
                            value={eventForm.cover_image_id}
                            onChange={(e) => setEventForm(prev => ({ ...prev, cover_image_id: e.target.value }))}
                            className={styles.coverImageSelect}
                          >
                            <option value="">Select an image</option>
                            {availableImages.map((image) => (
                              <option key={image.id} value={image.id}>
                                {image.title || 'Untitled'}
                              </option>
                            ))}
                          </select>
                          
                          <div className={styles.uploadDivider}>
                            <span>or</span>
                          </div>
                          
                          <div className={styles.uploadSection}>
                            {eventImagePreview ? (
                              <div className={styles.imagePreview}>
                                <img src={eventImagePreview} alt="Preview" />
                                <div className={styles.previewActions}>
                                  <button
                                    type="button"
                                    onClick={handleEventImageUpload}
                                    disabled={uploadingEventImage}
                                    className={styles.buttonPrimary}
                                  >
                                    {uploadingEventImage ? (
                                      <>
                                        <div className={styles.spinner} />
                                        <span>Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <UploadIcon />
                                        <span>Upload & Use</span>
                                      </>
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleEventImageRemove}
                                    className={styles.buttonSecondary}
                                  >
                                    <CloseIcon />
                                    <span>Remove</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className={styles.uploadPrompt}>
                                <button
                                  type="button"
                                  onClick={() => eventImageInputRef.current?.click()}
                                  className={styles.uploadButton}
                                >
                                  <UploadIcon />
                                  <span>Upload New Image</span>
                                </button>
                                <input
                                  ref={eventImageInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleEventImageSelect}
                                  className={styles.hiddenInput}
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="eventLinks">Links (max 3, one per line or comma/space separated)</label>
                        <textarea
                          id="eventLinks"
                          value={eventForm.linksText}
                          onChange={(e) => setEventForm(prev => ({ ...prev, linksText: e.target.value }))}
                          rows="3"
                          placeholder="https://drive.google.com/...\nhttps://drive.google.com/..."
                        />
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


