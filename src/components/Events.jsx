import React, { useEffect, useState } from 'react';
import styles from './Events.module.css';
import FlowingMenu from './FlowingMenu';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/events');
        const data = await response.json();
        
        if (response.ok) {
          setEvents(data.events || []);
        } else {
          setError(data.error || 'Failed to fetch events');
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

  // Transform events data for FlowingMenu component
  const eventsData = filteredEvents.map(event => ({
    link: '#',
    text: event.title,
    image: event.cover_image?.public_url || 'https://picsum.photos/600/400?random=1',
    description: event.description,
    startDate: event.start_date,
    endDate: event.end_date
  }));

  return (
    <div className={styles.events}>
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
        <div className={styles.eventsList}>
          {eventsData.length > 0 ? (
            <FlowingMenu items={eventsData} />
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
