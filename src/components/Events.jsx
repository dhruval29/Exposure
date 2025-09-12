import React, { useEffect, useState, useRef } from 'react';
import styles from './Events.module.css';
import FlowingMenu from './FlowingMenu';
import { supabase } from '../lib/supabaseClient';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const listRef = useRef(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const loadingPageRef = useRef(null);


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
            created_at,
            cover_image_id
          `)
          .eq('is_public', true)
          .order('created_at', { ascending: false });

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
          setEvents(eventsWithImages);
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

  // Toggle scroll box visibility similar to Frame50 behavior
  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight - 200;
      setHasScrolled(window.scrollY > triggerPoint);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Transform events data for FlowingMenu component
  const eventsData = filteredEvents.map(event => ({
    link: '#',
    text: event.title,
    image: event.cover_image?.public_url || 'https://picsum.photos/600/400?random=1',
    description: event.description,
    monthYear: event.month_year
  }));

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
              <FlowingMenu items={pagedEvents} />
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
                  <div className={`${styles.scrollBox} ${hasScrolled ? styles.fadeInFooter : styles.fadeOutFooter}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ cursor: 'pointer' }}>
                    <div className={styles.scrollBoxInner} />
                    <img className={styles.scrollArrow} alt="" src="/arrow-pointing-to-up-svgrepo-com.svg" />
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
