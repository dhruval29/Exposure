import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import styles from './Events.module.css';
import FlowingMenu from './FlowingMenu';
import Frame50 from './Frame50';
import SimpleNav from './SimpleNav';
import SmoothScrollWrapper from './SmoothScrollWrapper';
import { supabase } from '../lib/supabaseClient';
import '../styles/Gallery.css';

const Events = () => {

  const [events, setEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const listRef = useRef(null);
  const [showGuide, setShowGuide] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPagination, setShowPagination] = useState(false);
  const eventsSectionRef = useRef(null);
  const lastScrollYRef = useRef(0);
  const shouldRestoreScrollRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  // Parallax removed for featured images

  // Function to randomly select events for featured section
  const selectRandomEvents = (eventsList) => {
    if (eventsList.length === 0) return [];
    
    // Filter events that have cover images
    const eventsWithImages = eventsList.filter(event => event.cover_image && event.cover_image.public_url);
    
    if (eventsWithImages.length === 0) return [];
    
    // If we have 1 or 2 events with images, return them
    if (eventsWithImages.length <= 2) {
      return eventsWithImages;
    }
    
    // Randomly select 2 events from all uploaded events
    const shuffled = [...eventsWithImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  };

  // Set page size based on screen size
  useEffect(() => {
    const updatePageSize = () => {
      const width = window.innerWidth;
      if (width <= 360) {
        setPageSize(6); // Small mobile devices - display 6 events for better performance
      } else if (width <= 480) {
        setPageSize(8); // Mobile portrait - display 8 events
      } else if (width <= 768) {
        setPageSize(9); // Mobile landscape - display 9 events
      } else if (width <= 1024) {
        setPageSize(9); // Tablet - display 9 events
      } else {
        setPageSize(10); // Desktop - keep original
      }
    };

    updatePageSize();
    window.addEventListener('resize', updatePageSize);
    return () => window.removeEventListener('resize', updatePageSize);
  }, []);

  // Track mobile vs desktop to control rendering of small text boxes
  useEffect(() => {
    const updateIsMobile = () => setIsMobile(window.innerWidth <= 768);
    updateIsMobile();
    window.addEventListener('resize', updateIsMobile);
    return () => window.removeEventListener('resize', updateIsMobile);
  }, []);



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

  // Scroll detection for pagination visibility
  useEffect(() => {
    const handleScroll = () => {
      const searchBar = document.querySelector(`.${styles.searchContainer}`);
      if (searchBar) {
        const searchBarRect = searchBar.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const searchBarCrossed40Percent = searchBarRect.top <= (viewportHeight * 0.4);
        setShowPagination(searchBarCrossed40Percent);
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Check initial state
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
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
          
          // Select random events for featured section from all uploaded events
          const randomEvents = selectRandomEvents(sortedEvents);
          setFeaturedEvents(randomEvents);
        }
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
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

  // Prevent unintended page movement when search results update
  useLayoutEffect(() => {
    if (shouldRestoreScrollRef.current) {
      window.scrollTo({ top: lastScrollYRef.current, left: 0, behavior: 'auto' });
      shouldRestoreScrollRef.current = false;
    }
  }, [searchTerm]);

  // Guide disabled - no longer showing highlight animation
  useEffect(() => {
    // Guide functionality removed
  }, [events]);

  // Guide disabled - no longer needed
  const handleUserInteraction = () => {
    // Guide functionality removed
  };


  // Transform events data for FlowingMenu component
  const eventsData = filteredEvents.map((event, index) => {
    // Use the first link from the links array, or fallback to '#'
    const eventLink = (event.links && event.links.length > 0) ? event.links[0] : '#';
    const hasValidLink = eventLink !== '#' && eventLink && eventLink.trim() !== '';
    
    return {
      link: eventLink,
      text: event.title,
      image: event.cover_image?.public_url || 'https://picsum.photos/600/400?random=1',
      description: event.description,
      monthYear: event.month_year,
      hasValidLink: hasValidLink,
      showGuide: false, // Guide disabled
      onInteraction: handleUserInteraction
    };
  });

  const totalPages = Math.max(1, Math.ceil(eventsData.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const pagedEvents = eventsData.slice(startIndex, startIndex + pageSize);

  const goToPage = (page) => {
    const clamped = Math.min(Math.max(page, 1), totalPages);
    
    // On mobile, scroll to events list instead of top
    if (window.innerWidth <= 768) {
      const eventsList = document.querySelector(`.${styles.eventsList}`);
      if (eventsList) {
        eventsList.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // Desktop behavior - scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
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
    <>
      <SimpleNav />
      <Frame50 />
      <div className={styles.events}>
      
      {/* Featured Events section - moved up */}
      <div className={styles.eventsSection} ref={eventsSectionRef}>
        <div className={styles.img2024101415521735Parent}>
          {featuredEvents.length > 0 && (
            <>
              <img 
                className={styles.img2024101415521735Icon} 
                alt={featuredEvents[0].cover_image?.title || featuredEvents[0].title} 
                src={featuredEvents[0].cover_image?.public_url || "/assets/images/Sliding Page/1.webp"} 
              />
              <div className={styles.textBox1}>{featuredEvents[0].title}</div>
              
            </>
          )}
          {featuredEvents.length > 1 && (
            <>
              <img 
                className={styles.img2024101415521736Icon} 
                alt={featuredEvents[1].cover_image?.title || featuredEvents[1].title} 
                src={featuredEvents[1].cover_image?.public_url || "/assets/images/Sliding Page/5.webp"} 
              />
              <div className={styles.textBox1Second}>{featuredEvents[1].title}</div>
              
            </>
          )}
          {featuredEvents.length === 0 && (
            <>
              <img className={styles.img2024101415521735Icon} alt="" src="/assets/images/Sliding Page/1.webp" />
              <div className={styles.textBox1}>Featured Event Title</div>
              <img className={styles.img2024101415521736Icon} alt="" src="/assets/images/Sliding Page/5.webp" />
              <div className={styles.textBox1Second}>Second Event Title</div>
            </>
          )}
        </div>
      </div>
      
      {/* Events title aligned with search container */}
      <div className={styles.eventsTitleContainer}>
        <h1 className={styles.eventsTitle}>Events</h1>
      </div>
      
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
          onChange={(e) => {
            // Capture current scroll position and restore it after results render
            lastScrollYRef.current = window.scrollY;
            shouldRestoreScrollRef.current = true;
            setSearchTerm(e.target.value);
          }}
          onFocus={() => {
            // On mobile, scroll to search input when focused
            if (window.innerWidth <= 768) {
              setTimeout(() => {
                const searchContainer = document.querySelector(`.${styles.searchContainer}`);
                if (searchContainer) {
                  searchContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 100);
            }
          }}
        />
      </div>
      
      {error && (
        <div className={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      )}
      
      {!error && (
        <div className={styles.eventsList} ref={listRef}>
          {eventsData.length > 0 ? (
            <>
              <SmoothScrollWrapper>
                <FlowingMenu items={pagedEvents} onUserInteraction={handleUserInteraction} />
              </SmoothScrollWrapper>
              {totalPages >= 1 && showPagination && (
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
    </>
  );
};

export default Events;
