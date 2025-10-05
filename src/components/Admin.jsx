import { useEffect, useState, useRef } from 'react'
import { uploadImagesBatch } from '../lib/uploadImage'
import { Toaster, toast } from 'sonner'
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

const MessageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
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
  const [autoFeature, setAutoFeature] = useState(true)
  const [featureUploadFiles, setFeatureUploadFiles] = useState([])
  const featureUploadInputRef = useRef(null)
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
  
  // Contact messages state
  const [contactMessages, setContactMessages] = useState([])
  const [contactSearchQuery, setContactSearchQuery] = useState('')
  const [showContactMessage, setShowContactMessage] = useState(null)
  
  // Image upload state for event creation
  const [eventImageFile, setEventImageFile] = useState(null)
  const [eventImagePreview, setEventImagePreview] = useState('')
  const [uploadingEventImage, setUploadingEventImage] = useState(false)
  const eventImageInputRef = useRef(null)

  // Image metadata editing state (title/description)
  const [editedMeta, setEditedMeta] = useState({})
  const setMetaField = (id, field, value) => {
    setEditedMeta(prev => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [field]: value }
    }))
  }
  const saveImageMeta = async (img) => {
    const meta = editedMeta[img.id] || {}
    const nextTitle = meta.title ?? img.title ?? ''
    const nextDesc = meta.description ?? img.description ?? ''
    try {
      const { error } = await supabase
        .from('images')
        .update({ title: nextTitle || null, description: nextDesc || null })
        .eq('id', img.id)
      if (error) throw error
      // reflect in UI
      setAvailableImages(prev => prev.map(x => x.id === img.id ? { ...x, title: nextTitle || null, description: nextDesc || null } : x))
      setStatus('Saved image details')
    } catch (err) {
      setStatus(`Save failed: ${err.message}`)
    }
  }

  // Accordion state
  const [openSection, setOpenSection] = useState({
    media: true,
    featured: true,
    contacts: false,
    events: false,
  })
  const toggleSection = (key) => setOpenSection(prev => ({ ...prev, [key]: !prev[key] }))

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
        try {
          const parsed = JSON.parse(cached)
          const ttlMs = 5 * 60 * 1000 // 5 minutes
          const isFresh = typeof parsed.ts === 'number' && (Date.now() - parsed.ts) < ttlMs
          if (isFresh) {
            if (mounted) {
              setIsAdmin(Boolean(parsed.isAdmin))
              setChecking(false)
            }
            return
          }
        } catch {}
      }

      const { data } = await supabase.auth.getUser()
      const uid = data?.user?.id
      if (!uid) {
        if (mounted) { setIsAdmin(false); setChecking(false) }
        return
      }
      const { data: isAdminResp, error: rpcError } = await supabase.rpc('is_admin', { uid })
      
      if (rpcError) {
        console.error('RPC Error:', rpcError)
        console.error('Error details:', {
          message: rpcError.message,
          details: rpcError.details,
          hint: rpcError.hint,
          code: rpcError.code
        })
        if (mounted) { 
          setIsAdmin(false); 
          setChecking(false)
          setStatus(`Admin check failed: ${rpcError.message}`)
        }
        return
      }
      
      const result = Boolean(isAdminResp)
      sessionStorage.setItem('ee_admin_check', JSON.stringify({ isAdmin: result, ts: Date.now() }))
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

    // Also re-check when the page regains focus (handles role changes granted server-side)
    const onFocus = () => {
      sessionStorage.removeItem('ee_admin_check')
      setChecking(true)
      checkAdmin(true)
    }
    window.addEventListener('focus', onFocus)

    return () => { mounted = false; sub.subscription.unsubscribe(); window.removeEventListener('focus', onFocus) }
  }, [])

  // Load events, available images, and contact messages
  useEffect(() => {
    if (isAdmin) {
      loadEvents()
      loadAvailableImages()
      loadContactMessages()
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
        .select('id, public_url, title, is_featured, featured_order, storage_path')
        .eq('is_public', true)
        .order('featured_order', { ascending: true, nullsFirst: false })
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

  const toggleFeatured = async (imageId, current) => {
    try {
      const { error } = await supabase
        .from('images')
        .update({ is_featured: !current })
        .eq('id', imageId)
      if (error) throw error
      setAvailableImages(prev => prev.map(img => img.id === imageId ? { ...img, is_featured: !current } : img))
    } catch (err) {
      setStatus(`Failed to update featured: ${err.message}`)
    }
  }

  const updateFeaturedOrder = async (imageId, orderVal) => {
    const parsed = Number.isFinite(orderVal) ? Math.trunc(orderVal) : null
    try {
      const { error } = await supabase
        .from('images')
        .update({ featured_order: parsed })
        .eq('id', imageId)
      if (error) throw error
      setAvailableImages(prev => prev.map(img => img.id === imageId ? { ...img, featured_order: parsed } : img))
    } catch (err) {
      setStatus(`Failed to update order: ${err.message}`)
    }
  }

  const deleteImage = async (img) => {
    if (!img) return
    if (!confirm('Delete this image permanently?')) return
    setStatus('Deleting image...')
    try {
      if (img.storage_path) {
        const { error: rmErr } = await supabase.storage.from('images').remove([img.storage_path])
        if (rmErr) console.warn('Storage remove warning:', rmErr.message)
      }
      const { error: delErr } = await supabase
        .from('images')
        .delete()
        .eq('id', img.id)
      if (delErr) throw delErr
      setAvailableImages(prev => prev.filter(x => x.id !== img.id))
      setUploaded(prev => prev.filter(x => x.id !== img.id))
      setStatus('Image deleted')
    } catch (err) {
      setStatus(`Delete failed: ${err.message}`)
    }
  }

  const isImageFile = (file) => {
    if (!file) return false
    if (file.type && file.type.startsWith('image/')) return true
    const name = (file.name || '').toLowerCase()
    return /\.(png|jpe?g|webp|gif|bmp|tiff?|svg)$/.test(name)
  }

  const onFeatureUploadBrowse = (e) => {
    const list = Array.from(e.target.files || []).filter(isImageFile)
    setFeatureUploadFiles(list)
    if (list.length) toast.success(`Selected ${list.length} image${list.length > 1 ? 's' : ''}`)
  }

  const pickImageFiles = async (multiple = true) => {
    try {
      if ('showOpenFilePicker' in window) {
        const handles = await window.showOpenFilePicker({
          multiple,
          types: [{ description: 'Images', accept: { 'image/*': ['.png','.jpg','.jpeg','.webp','.gif','.bmp','.tif','.tiff','.svg'] } }]
        })
        const files = await Promise.all(handles.map(h => h.getFile()))
        return files.filter(isImageFile)
      }
    } catch {}
    return null
  }

  const onFeatureUpload = async () => {
    if (!featureUploadFiles.length) return
    setStatus('Uploading to featured...')
    try {
      const rows = await uploadImagesBatch(featureUploadFiles, { isPublic: true })
      // Optionally mark featured
      if (autoFeature && rows && rows.length) {
        const ids = rows.map(r => r.id)
        const { error } = await supabase
          .from('images')
          .update({ is_featured: true })
          .in('id', ids)
        if (error) throw error
      }
      // Refresh list and clear
      await loadAvailableImages()
      setFeatureUploadFiles([])
      if (featureUploadInputRef.current) featureUploadInputRef.current.value = ''
      setStatus('Featured upload successful')
      toast.success('Featured upload successful')
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`)
      toast.error(err.message)
    }
  }

  const loadContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('event_contact_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setStatus(`Error loading contact messages: ${error.message}`)
      } else {
        setContactMessages(data || [])
      }
    } catch (err) {
      setStatus(`Error loading contact messages: ${err.message}`)
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

  // Filter contact messages based on search query
  const filteredContactMessages = contactMessages.filter(message => {
    if (!contactSearchQuery.trim()) return true
    
    const query = contactSearchQuery.toLowerCase()
    const name = (message.name || '').toLowerCase()
    const email = (message.email || '').toLowerCase()
    const phone = (message.phone || '').toLowerCase()
    const eventAbout = (message.event_about || '').toLowerCase()
    const eventWhen = (message.event_when || '').toLowerCase()
    
    return name.includes(query) || 
           email.includes(query) || 
           phone.includes(query) ||
           eventAbout.includes(query) ||
           eventWhen.includes(query)
  })

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const onDrop = (e) => {
    e.preventDefault(); e.stopPropagation(); setDrag(false)
    const list = Array.from(e.dataTransfer.files || []).filter(f => f.type.startsWith('image/'))
    if (list.length) setFiles(prev => [...prev, ...list])
    if (list.length) toast.success(`Added ${list.length} file${list.length > 1 ? 's' : ''}`)
  }

  const onBrowse = (e) => {
    const list = Array.from(e.target.files || [])
    if (list.length) setFiles(prev => [...prev, ...list])
    if (list.length) toast.success(`Added ${list.length} file${list.length > 1 ? 's' : ''}`)
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
      toast.success(`Uploaded ${rows.length} image${rows.length > 1 ? 's' : ''}`)
      setFiles([])
    } catch (err) {
      setStatus(err.message)
      toast.error(err.message)
    }
  }

  const pct = progress.total ? Math.round((progress.index / progress.total) * 100) : 0

  return (
    <AuthGate>
      <div className={styles.container}>
        <Toaster richColors position="top-right" />
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
              {/* Media Management (Accordion) */}
              <div className={styles.accordionHeader} onClick={() => toggleSection('media')}>
                <h2 className={styles.accordionTitle}>
                  <ImageIcon />
                  <span>Media Management</span>
                </h2>
                <div className={styles.accordionActions}>
                  <button type="button" className={styles.plusButton}>{openSection.media ? '−' : '+'}</button>
                </div>
              </div>
              <div className={`${styles.accordionPanel} ${openSection.media ? styles.accordionPanelOpen : ''}`}>
                <div className={styles.accordionInner}>
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
                    onClick={async () => { 
                      if (inputRef.current) { inputRef.current.value = ''; }
                      const picked = await pickImageFiles(true)
                      if (picked && picked.length) {
                        setFiles(prev => [...prev, ...picked])
                        return
                      }
                      inputRef.current?.click()
                    }}
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
                </div>
              </div>

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
                        <div className={styles.formInlineColumn} style={{ gap: 6, marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder="Title"
                            value={(editedMeta[row.id]?.title) ?? row.title ?? ''}
                            onChange={(e) => setMetaField(row.id, 'title', e.target.value)}
                            className={styles.metaInput}
                          />
                          <textarea
                            rows="2"
                            placeholder="Short description"
                            value={(editedMeta[row.id]?.description) ?? row.description ?? ''}
                            onChange={(e) => setMetaField(row.id, 'description', e.target.value)}
                            className={styles.metaTextarea}
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              type="button"
                              className={styles.buttonPrimary}
                              onClick={() => saveImageMeta(row)}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className={styles.buttonDanger}
                              onClick={() => deleteImage(row)}
                            >
                              <CloseIcon />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Featured Pictures (Accordion) */}
              <div className={styles.accordionHeader} onClick={() => toggleSection('featured')}>
                <h2 className={styles.accordionTitle}>
                  <ImageIcon />
                  <span>Featured Pictures</span>
                </h2>
                <div className={styles.accordionActions}>
                  <span className={styles.count}>{availableImages.length}</span>
                  <button type="button" className={styles.plusButton}>{openSection.featured ? '−' : '+'}</button>
                </div>
              </div>
              <div className={`${styles.accordionPanel} ${openSection.featured ? styles.accordionPanelOpen : ''}`}>
                <div className={styles.accordionInner}>
                  <section className={styles.section}>
                    <div className={styles.sectionActions}>
                      <button 
                        className={styles.buttonSecondary}
                        onClick={loadAvailableImages}
                        type="button"
                      >
                        <SearchIcon />
                        <span>Refresh</span>
                      </button>
                    </div>

                {/* Upload into library with optional auto-feature */}
                <div className={styles.uploadSection} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      ref={featureUploadInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={onFeatureUploadBrowse}
                      className={styles.hiddenInput}
                    />
                    <button
                      type="button"
                      className={styles.buttonSecondary}
                      onClick={async () => {
                        if (featureUploadInputRef.current) { featureUploadInputRef.current.value = ''; }
                        const picked = await pickImageFiles(true)
                        if (picked && picked.length) {
                          setFeatureUploadFiles(picked)
                          return
                        }
                        featureUploadInputRef.current?.click()
                      }}
                    >
                      <FolderIcon />
                      <span>Select Images</span>
                    </button>
                    <button
                      type="button"
                      className={styles.buttonPrimary}
                      disabled={!featureUploadFiles.length}
                      onClick={onFeatureUpload}
                    >
                      <UploadIcon />
                      <span>Upload {featureUploadFiles.length ? `(${featureUploadFiles.length})` : ''}</span>
                    </button>
                    <label className={styles.toggleLabel} style={{ marginLeft: 'auto' }}>
                      <input
                        type="checkbox"
                        className={styles.toggleInput}
                        checked={autoFeature}
                        onChange={() => setAutoFeature(v => !v)}
                      />
                      <span>Auto‑feature after upload</span>
                    </label>
                  </div>
                </div>

                {availableImages.length ? (
                  <div className={styles.imageGrid}>
                    {availableImages.map((img) => (
                      <div key={img.id} className={styles.imageCard}>
                        <div className={styles.imageWrapper}>
                          <img src={img.public_url} alt={img.title || 'image'} />
                        </div>
                        <div className={styles.imageInfo}>
                          <span className={styles.imageName}>{img.title || 'Untitled'}</span>
                        </div>
                        <div className={styles.formInlineRow}>
                          <label className={styles.toggleLabel}>
                            <input
                              type="checkbox"
                              className={styles.toggleInput}
                              checked={Boolean(img.is_featured)}
                              onChange={() => toggleFeatured(img.id, Boolean(img.is_featured))}
                            />
                            <span>Featured</span>
                          </label>
                          <label className={styles.orderLabel}>
                            <span>Order</span>
                            <input
                              type="number"
                              min="0"
                              inputMode="numeric"
                              className={styles.orderInput}
                              value={img.featured_order ?? ''}
                              placeholder="—"
                              onChange={(e) => {
                                const val = e.target.value === '' ? '' : Number(e.target.value)
                                setAvailableImages(prev => prev.map(x => x.id === img.id ? { ...x, featured_order: val === '' ? null : val } : x))
                              }}
                              onBlur={(e) => updateFeaturedOrder(img.id, e.target.value === '' ? null : Number(e.target.value))}
                            />
                          </label>
                          <button 
                            type="button" 
                            className={styles.buttonDanger}
                            onClick={() => deleteImage(img)}
                          >
                            <CloseIcon />
                            <span>Delete</span>
                          </button>
                        </div>
                        <div className={styles.formInlineColumn} style={{ gap: 6, marginTop: 8 }}>
                          <input
                            type="text"
                            placeholder="Title"
                            value={(editedMeta[img.id]?.title) ?? img.title ?? ''}
                            onChange={(e) => setMetaField(img.id, 'title', e.target.value)}
                            className={styles.metaInput}
                          />
                          <textarea
                            rows="2"
                            placeholder="Short description"
                            value={(editedMeta[img.id]?.description) ?? img.description ?? ''}
                            onChange={(e) => setMetaField(img.id, 'description', e.target.value)}
                            className={styles.metaTextarea}
                          />
                          <div style={{ display: 'flex', gap: 8 }}>
                            <button
                              type="button"
                              className={styles.buttonPrimary}
                              onClick={() => saveImageMeta(img)}
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <ImageIcon />
                    <p>No images found. Upload images first.</p>
                  </div>
                )}
                  </section>
                </div>
              </div>

              {/* Contact Messages (Accordion) */}
              <div className={styles.accordionHeader} onClick={() => toggleSection('contacts')}>
                <h2 className={styles.accordionTitle}>
                  <MessageIcon />
                  <span>Contact Messages</span>
                </h2>
                <div className={styles.accordionActions}>
                  <span className={styles.count}>{contactMessages.length}</span>
                  <button type="button" className={styles.plusButton}>{openSection.contacts ? '−' : '+'}</button>
                </div>
              </div>
              <div className={`${styles.accordionPanel} ${openSection.contacts ? styles.accordionPanelOpen : ''}`}>
                <div className={styles.accordionInner}>
                  <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <MessageIcon />
                    <span>Contact Messages</span>
                    <span className={styles.count}>
                      {contactSearchQuery ? `${filteredContactMessages.length}/${contactMessages.length}` : contactMessages.length}
                    </span>
                  </h2>
                  <div className={styles.sectionActions}>
                    <div className={styles.searchContainer}>
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search messages..."
                        value={contactSearchQuery}
                        onChange={(e) => setContactSearchQuery(e.target.value)}
                        className={styles.searchInput}
                      />
                    </div>
                    <button 
                      className={styles.buttonSecondary}
                      onClick={loadContactMessages}
                      type="button"
                    >
                      <SearchIcon />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>

                {filteredContactMessages.length > 0 ? (
                  <div className={styles.contactMessagesGrid}>
                    {filteredContactMessages.map((message) => (
                      <div key={message.id} className={styles.contactMessageCard}>
                        <div className={styles.contactMessageHeader}>
                          <div className={styles.contactMessageInfo}>
                            <h3 className={styles.contactMessageName}>{message.name}</h3>
                            <span className={styles.contactMessageDate}>
                              {formatDate(message.created_at)}
                            </span>
                          </div>
                          <button 
                            className={styles.buttonSecondary}
                            onClick={() => setShowContactMessage(message)}
                            type="button"
                          >
                            <EditIcon />
                            <span>View Details</span>
                          </button>
                        </div>
                        <div className={styles.contactMessageContent}>
                          <div className={styles.contactMessageField}>
                            <MailIcon />
                            <span>{message.email}</span>
                          </div>
                          <div className={styles.contactMessageField}>
                            <PhoneIcon />
                            <span>{message.phone}</span>
                          </div>
                          {message.event_about && (
                            <div className={styles.contactMessageField}>
                              <MessageIcon />
                              <span className={styles.contactMessageText}>
                                {message.event_about.length > 100 
                                  ? `${message.event_about.substring(0, 100)}...` 
                                  : message.event_about
                                }
                              </span>
                            </div>
                          )}
                          {message.event_when && (
                            <div className={styles.contactMessageField}>
                              <CalendarIcon />
                              <span>{message.event_when}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <MessageIcon />
                    <p>
                      {contactSearchQuery 
                        ? `No messages found matching "${contactSearchQuery}"`
                        : 'No contact messages yet.'
                      }
                    </p>
                    {contactSearchQuery && (
                      <button 
                        className={styles.buttonSecondary}
                        onClick={() => setContactSearchQuery('')}
                        type="button"
                      >
                        Clear search
                      </button>
                    )}
                  </div>
                )}
                  </section>
                </div>
              </div>

              {/* Events Management (Accordion) */}
              <div className={styles.accordionHeader} onClick={() => toggleSection('events')}>
                <h2 className={styles.accordionTitle}>
                  <EventIcon />
                  <span>Events Management</span>
                </h2>
                <div className={styles.accordionActions}>
                  <span className={styles.count}>{events.length}</span>
                  <button type="button" className={styles.plusButton}>{openSection.events ? '−' : '+'}</button>
                </div>
              </div>
              <div className={`${styles.accordionPanel} ${openSection.events ? styles.accordionPanelOpen : ''}`}>
                <div className={styles.accordionInner}>
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
                </div>
              </div>

              {/* Contact Message Detail Modal */}
              {showContactMessage && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <div className={styles.modalHeader}>
                      <h3>Contact Message Details</h3>
                      <button 
                        className={styles.closeButton}
                        onClick={() => setShowContactMessage(null)}
                        type="button"
                      >
                        <CloseIcon />
                      </button>
                    </div>
                    <div className={styles.contactMessageDetail}>
                      <div className={styles.contactMessageDetailField}>
                        <label>Name:</label>
                        <span>{showContactMessage.name}</span>
                      </div>
                      <div className={styles.contactMessageDetailField}>
                        <label>Email:</label>
                        <span>{showContactMessage.email}</span>
                      </div>
                      <div className={styles.contactMessageDetailField}>
                        <label>Phone:</label>
                        <span>{showContactMessage.phone}</span>
                      </div>
                      <div className={styles.contactMessageDetailField}>
                        <label>Submitted:</label>
                        <span>{formatDate(showContactMessage.created_at)}</span>
                      </div>
                      {showContactMessage.event_about && (
                        <div className={styles.contactMessageDetailField}>
                          <label>Event Details:</label>
                          <span>{showContactMessage.event_about}</span>
                        </div>
                      )}
                      {showContactMessage.event_when && (
                        <div className={styles.contactMessageDetailField}>
                          <label>Event When:</label>
                          <span>{showContactMessage.event_when}</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.formActions}>
                      <button 
                        type="button" 
                        className={styles.buttonSecondary}
                        onClick={() => setShowContactMessage(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}

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


