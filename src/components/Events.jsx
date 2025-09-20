import React, { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import styles from './Events.module.css';
import FlowingMenu from './FlowingMenu';
import StaggeredMenuFinal from './StaggeredMenuFinal';
import { supabase } from '../lib/supabaseClient';
import '../styles/Gallery.css';

const Events = () => {
  const menuItems = [
    { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
    { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
    { label: 'Services', ariaLabel: 'View our services', link: '/services' },
    { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
  ];

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const listRef = useRef(null);
  const loadingPageRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const loaderRef = useRef(null);
  const loaderPanelRef = useRef(null);
  const loaderTextRef = useRef(null);

  // Set page size based on screen size
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      if (width <= 360) {
        setPageSize(8); // Small mobile devices
      } else if (width <= 480) {
        setPageSize(8); // Mobile portrait
      } else if (width <= 768) {
        setPageSize(9); // Mobile landscape
      } else if (width <= 1024) {
        setPageSize(9); // Tablet
      } else {
        setPageSize(10); // Desktop - keep original
      }
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);



  // Shutter loader animation
  useEffect(() => {
    if (!showLoader) return;
    const wrapper = loaderRef.current;
    const panel = loaderPanelRef.current;
    const text = loaderTextRef.current;
    if (!wrapper || !panel || !text) return;

    gsap.set(panel, { height: '100vh' });
    gsap.set(text, { autoAlpha: 1, y: 0 });

    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    tl.to(text, { autoAlpha: 1, duration: 0.2 })
      .add('reveal')
      .to(panel, { height: 0, duration: 2.0, ease: 'power4.inOut' }, 'reveal')
      .to(text, { autoAlpha: 0, duration: 0.6, ease: 'power2.out' }, 'reveal+=0.3')
      .set(wrapper, { pointerEvents: 'none', display: 'none' })
      .add(() => setShowLoader(false));

    return () => { tl.kill(); };
  }, [showLoader]);

  useEffect(() => {
    // Enhanced smooth scroll for better browser support
    const smoothScrollTo = (target, duration = 1000) => {
      const targetElement = document.querySelector(target);
      if (!targetElement) return;

      const targetPosition = targetElement.offsetTop;
      const startPosition = window.pageYOffset;
      const distance = targetPosition - startPosition;
      let startTime = null;

      const animation = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
      };

      const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
      };

      requestAnimationFrame(animation);
    };

    // Add smooth scroll to all anchor links
    const handleSmoothScroll = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
      }
    };

    // Add event listeners to all links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', handleSmoothScroll);
    });

    // Cleanup
    return () => {
      links.forEach(link => {
        link.removeEventListener('click', handleSmoothScroll);
      });
    };
  }, []);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data: events, error } = await supabase
          .from('events')
          .select(`
            id,
            title,
            description,
            month_year,
            links,
            created_at,
            cover_image_id
          `)
          .eq('is_public', true);

        if (error) {
          console.error('Error fetching events:', error);
          setError(error.message);
        } else {
          // Fetch cover images separately to avoid relationship conflicts
          const eventsWithImages = await Promise.all(
            (events || []).map(async (event) => {
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
          
          // Sort events by month_year with latest first
          const sortedEvents = eventsWithImages.sort((a, b) => {
            // Parse month_year strings (assuming format like "January 2024", "Feb 2023", etc.)
            const parseMonthYear = (monthYear) => {
              if (!monthYear) return new Date(0); // fallback for missing dates
              
              // Handle various formats: "January 2024", "Jan 2024", "01/2024", "2024-01", etc.
              const monthNames = {
                'january': 0, 'jan': 0,
                'february': 1, 'feb': 1,
                'march': 2, 'mar': 2,
                'april': 3, 'apr': 3,
                'may': 4,
                'june': 5, 'jun': 5,
                'july': 6, 'jul': 6,
                'august': 7, 'aug': 7,
                'september': 8, 'sep': 8, 'sept': 8,
                'october': 9, 'oct': 9,
                'november': 10, 'nov': 10,
                'december': 11, 'dec': 11
              };
              
              const str = monthYear.toLowerCase().trim();
              
              // Try to parse different formats
              if (str.includes('/')) {
                // Format: "01/2024" or "1/2024"
                const [month, year] = str.split('/');
                return new Date(parseInt(year), parseInt(month) - 1);
              } else if (str.includes('-')) {
                // Format: "2024-01"
                const [year, month] = str.split('-');
                return new Date(parseInt(year), parseInt(month) - 1);
              } else {
                // Format: "January 2024" or "Jan 2024"
                const parts = str.split(' ');
                if (parts.length >= 2) {
                  const monthName = parts[0];
                  const year = parseInt(parts[parts.length - 1]);
                  const monthNum = monthNames[monthName];
                  if (monthNum !== undefined && !isNaN(year)) {
                    return new Date(year, monthNum);
                  }
                }
              }
              
              // Fallback: try to parse as a date string
              const date = new Date(monthYear);
              return isNaN(date.getTime()) ? new Date(0) : date;
            };
            
            const dateA = parseMonthYear(a.month_year);
            const dateB = parseMonthYear(b.month_year);
            
            // Sort in descending order (latest first)
            return dateB.getTime() - dateA.getTime();
          });
          
          setEvents(sortedEvents);
        }
      } catch (err) {
        setError('Failed to fetch events');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search term
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Show guide for first-time users
  useEffect(() => {
    const hasVisitedEvents = localStorage.getItem('hasVisitedEvents');
    if (!hasVisitedEvents && !loading && events.length > 0) {
      // Find the first event with a valid link
      const firstClickableEvent = events.find(event => 
        event.links && event.links.length > 0 && event.links[0] !== '#'
      );
      
      if (firstClickableEvent) {
        // Show guide after a short delay to let the page load
        setTimeout(() => {
          setShowGuide(true);
        }, 2000);
      }
    }
  }, [loading, events]);

  // Handle user interaction to hide guide
  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      setShowGuide(false);
      localStorage.setItem('hasVisitedEvents', 'true');
    }
  };


  // Transform events data for FlowingMenu component
  const eventsData = filteredEvents.map((event, index) => {
    // Use the first link from the links array, or fallback to '#'
    const eventLink = (event.links && event.links.length > 0) ? event.links[0] : '#';
    const hasValidLink = eventLink !== '#' && eventLink && eventLink.trim() !== '';
    
    // Check if this is the first clickable event for the guide
    const isFirstClickable = showGuide && hasValidLink && 
      filteredEvents.findIndex(e => e.links && e.links.length > 0 && e.links[0] !== '#') === index;
    
    return {
      link: eventLink,
      text: event.title,
      image: event.cover_image?.public_url || 'https://picsum.photos/600/400?random=1',
      description: event.description,
      monthYear: event.month_year,
      hasValidLink: hasValidLink,
      showGuide: isFirstClickable,
      onInteraction: handleUserInteraction
    };
  });

  const totalPages = Math.max(1, Math.ceil(eventsData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedEvents = eventsData.slice(startIndex, startIndex + pageSize);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    // Scroll to top smoothly and animate list transition
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const el = listRef.current;
    if (el) {
      el.classList.add(styles.fadeOut);
      setTimeout(() => {
        setCurrentPage(clamped);
        el.classList.remove(styles.fadeOut);
        el.classList.add(styles.fadeIn);
        setTimeout(() => {
          el.classList.remove(styles.fadeIn);
        }, 300);
      }, 220);
    } else {
      setCurrentPage(clamped);
    }
  };

  return (
    <div className={styles.events}>
      <StaggeredMenuFinal
        position="right"
        items={menuItems}
        displaySocials={true}
        displayItemNumbering={false}
        menuButtonColor="#000"
        openMenuButtonColor="#000"
        changeMenuColorOnOpen={true}
        colors={["#fecaca", "#fde68a"]}
        logoUrl="/assets/icons/new-arrow.svg"
        accentColor="#6b7280"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
      {showLoader && (
        <div
          ref={loaderRef}
          style={{ position: 'fixed', inset: 0, zIndex: 100000, overflow: 'hidden', pointerEvents: 'auto' }}
        >
          <div
            ref={loaderPanelRef}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100vh', background: 'white', transformOrigin: 'top center' }}
          />
          <div
            ref={loaderTextRef}
            style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'black', fontSize: 'clamp(24px, 6vw, 64px)', fontFamily: 'Helvetica, Arial, sans-serif', letterSpacing: '0.02em' }}
          >
            Events
          </div>
        </div>
      )}
      {loading && (
        <div className="c-loading-page" ref={loadingPageRef}>
          <div className="c-loading-page__content">
            <p className="c-loading-page__text">
              {'Events'.split('').map((char, index) => (
                <span key={index} className="char" style={{ animationDelay: `${index * 100}ms` }}>
                  {char}
                </span>
              ))}
            </p>
          </div>
        </div>
      )}
      <b className={styles.events2}>Events</b>
      <div className={styles.searchContainer}>
        <img 
          className={styles.magnifyingGlassSvgrepoCom1Icon} 
          alt="Search" 
          src="/assets/icons/magnifying-glass-svgrepo-com 1.svg" 
        />
        <input 
          type="text" 
          placeholder="Search events..." 
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading && (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading events...</p>
        </div>
      )}
      
      {error && (
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      )}
      
      {!loading && !error && (
        <div className={styles.eventsList} ref={listRef}>
          {eventsData.length > 0 ? (
            <>
              <FlowingMenu items={pagedEvents} onUserInteraction={handleUserInteraction} />
              {totalPages >= 1 && (
                <div className={styles.footerBar}>
                  <div className={styles.pagination}>
                    <button className={styles.pageButton} onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                      Prev
                    </button>
                    <div className={styles.pageNumbers}>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                        <button
                          key={n}
                          className={`${styles.pageNumber} ${n === currentPage ? styles.activePage : ''}`}
                          onClick={() => goToPage(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <button className={styles.pageButton} onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.noEventsContainer}>
              <p>No events found{searchTerm ? ' matching your search' : ''}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Events;
