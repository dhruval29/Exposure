import React from 'react';
import './ContactUsMobile.css';
import { supabase } from '../lib/supabaseClient';
import { Calendar24 } from '@/components/Calendar24';
import SimpleNav from './SimpleNav';

const BASE_DELAY_MS = 500;

function LabelWithLine({ label, delayMs = 0, animationsReady }) {
  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <label className={animationsReady ? "cu-mobile-text" : ""} style={{ display: 'block', fontFamily: "'PP Editorial New', serif", fontSize: 20, color: 'transparent', marginBottom: '1.5vw', animationDelay: animationsReady ? `${BASE_DELAY_MS + delayMs}ms` : '0ms' }}>
        {label}
      </label>
      <div className={animationsReady ? "cu-mobile-line" : ""} style={{ borderBottom: '1px solid #000', width: '100%', height: 1, animationDelay: animationsReady ? `${BASE_DELAY_MS + delayMs}ms` : '0ms' }} />
    </div>
  );
}

export default function ContactUsMobile() {
  const [form, setForm] = React.useState({ name: '', phone: '', email: '', eventAbout: '', eventWhen: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitMsg, setSubmitMsg] = React.useState('');
  const [animationsReady, setAnimationsReady] = React.useState(() => {
    if (!window.__routeTransitionActive) return true;
    return !!window.__routeTransitionHalfExit;
  });

  React.useEffect(() => {
    if (animationsReady) return;
    const onHalf = () => setAnimationsReady(true);
    window.addEventListener('route-transition-half-exit', onHalf);
    const fallback = setTimeout(() => setAnimationsReady(true), 3000);
    return () => {
      window.removeEventListener('route-transition-half-exit', onHalf);
      clearTimeout(fallback);
    };
  }, [animationsReady]);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitMsg('');
    if (!form.name || !form.phone || !form.email) {
      setSubmitMsg('Please fill name, phone and email.');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('event_contact_requests').insert({
        name: form.name,
        phone: form.phone,
        email: form.email,
        event_about: form.eventAbout,
        event_when: form.eventWhen,
      });
      if (error) throw error;
      setSubmitMsg('Thanks! We will get back to you soon.');
      setForm({ name: '', phone: '', email: '', eventAbout: '', eventWhen: '' });
    } catch (e) {
      console.error('Contact form submission failed:', e);
      setSubmitMsg(`Submission failed: ${e?.message || 'Please try again.'}`);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <SimpleNav />
      <div className="contact-mobile-gradient" style={{ minHeight: '100vh', padding: '3px 6vw' }}>
      <div style={{ marginBottom: '7vh' }}>
        <h1 className={animationsReady ? "cu-mobile-text" : ""} style={{ fontFamily: "'PP Editorial New', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 64, color: '#000', lineHeight: 1, marginTop: '8vh', marginBottom: 16, animationDelay: animationsReady ? `${BASE_DELAY_MS}ms` : '0ms' }}>
          Contact
        </h1>
        <div className={animationsReady ? "cu-mobile-line" : ""} style={{ width: '100%', height: 1, backgroundColor: '#000', marginBottom: '6vh' }} />
        <div style={{ textAlign: 'center' }}>
          <p className={animationsReady ? "cu-mobile-text" : ""} style={{ fontFamily: "'PP Editorial New', serif", fontSize: 24, color: '#000', lineHeight: 1.5, marginBottom: 4, animationDelay: animationsReady ? `${BASE_DELAY_MS + 120}ms` : '0ms' }}>
            Want help covering a event ?
          </p>
          <p className={animationsReady ? "cu-mobile-text" : ""} style={{ fontFamily: "'PP Editorial New', serif", fontSize: 24, color: '#000', lineHeight: 1.5, animationDelay: animationsReady ? `${BASE_DELAY_MS + 200}ms` : '0ms' }}>
            Reach out using the form below!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '6vw', marginBottom: '10vh' }}>
        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 240}ms` : '0ms', position: 'relative' }}>
          <LabelWithLine delayMs={240} label={"Your Name (or your Club's)"} animationsReady={animationsReady} />
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            autoComplete="name"
            placeholder="Your name (or your Club's name)"
            style={{ 
              position: 'absolute',
              top: '20%',
              left: 0,
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              fontFamily: "'PP Editorial New', serif", 
              fontSize: 18, 
              color: '#000', 
              padding: '0.4vh 0',
              transition: 'all 0.2s ease',
              marginTop: '0px'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderRadius = '4px';
              e.target.style.boxShadow = '0 0 0 2px rgba(17, 42, 70, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderRadius = '0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 320}ms` : '0ms', position: 'relative' }}>
          <LabelWithLine delayMs={320} label="Phone" animationsReady={animationsReady} />
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            autoComplete="tel"
            placeholder="Phone number"
            style={{ 
              position: 'absolute',
              top: '20%',
              left: 0,
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              fontFamily: "'PP Editorial New', serif", 
              fontSize: 18, 
              color: '#000', 
              padding: '0.4vh 0',
              transition: 'all 0.2s ease',
              marginTop: '0px'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderRadius = '4px';
              e.target.style.boxShadow = '0 0 0 2px rgba(17, 42, 70, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderRadius = '0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 380}ms` : '0ms', position: 'relative' }}>
          <LabelWithLine delayMs={380} label="Email" animationsReady={animationsReady} />
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            autoComplete="email"
            placeholder="Email address"
            style={{ 
              position: 'absolute',
              top: '20%',
              left: 0,
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              fontFamily: "'PP Editorial New', serif", 
              fontSize: 18, 
              color: '#000', 
              padding: '0.4vh 0',
              transition: 'all 0.2s ease',
              marginTop: '0px'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderRadius = '4px';
              e.target.style.boxShadow = '0 0 0 2px rgba(17, 42, 70, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderRadius = '0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 440}ms` : '0ms', position: 'relative' }}>
          <LabelWithLine delayMs={440} label={"What's the event about?"} animationsReady={animationsReady} />
          <input
            type="text"
            value={form.eventAbout}
            onChange={handleChange('eventAbout')}
            placeholder="Describe your event"
            style={{ 
              position: 'absolute',
              top: '20%',
              left: 0,
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              outline: 'none', 
              fontFamily: "'PP Editorial New', serif", 
              fontSize: 18, 
              color: '#000', 
              padding: '0.3vh 0',
              transition: 'all 0.2s ease',
              marginTop: '0px'
            }}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderRadius = '4px';
              e.target.style.boxShadow = '0 0 0 2px rgba(17, 42, 70, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.borderRadius = '0';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 500}ms` : '0ms' }}>
          <label className={animationsReady ? "cu-mobile-text" : ""} style={{ display: 'block', fontFamily: "'PP Editorial New', serif", fontSize: 20, color: 'transparent', marginBottom: '1.5vw' }}>When's the Event?</label>
          <div style={{ padding: '0.3vh 0' }}>
            <Calendar24
              value={form.eventWhen ? new Date(form.eventWhen) : undefined}
              onChange={(d) => setForm((prev) => ({ ...prev, eventWhen: d ? new Date(d).toISOString() : '' }))}
            />
          </div>
        </div>

        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ display: 'flex', justifyContent: 'center', paddingTop: '2vh', animationDelay: animationsReady ? `${BASE_DELAY_MS + 560}ms` : '0ms' }}>
          <button onClick={handleSubmit} disabled={submitting}
            type="button"
            style={{ backgroundColor: '#112a46', borderRadius: 18, padding: '2vh 4vw', width: '100%', maxWidth: '40vw', textAlign: 'center' }}
          >
            <span style={{ fontFamily: "'Inter', 'Roboto', 'Source Sans Pro', 'Open Sans', 'Nunito Sans', 'Helvetica Light', 'Helvetica', Arial, sans-serif", fontSize: 18, color: '#fff', lineHeight: 1.5 }}>{submitting ? 'Sending…' : 'Reach Us!'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '4vw' }}>
        <div className={animationsReady ? "cu-mobile-text" : ""} style={{ textAlign: 'center', animationDelay: animationsReady ? `${BASE_DELAY_MS + 700}ms` : '0ms' }}>
          <a
            href="mailto:exposure.explorers@nitgoa.ac.in"
            style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', textDecoration: 'underline', cursor: 'pointer' }}
          >
            exposure.explorers@nitgoa.ac.in
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3vw', textAlign: 'center' }}>
          <a className={animationsReady ? "cu-mobile-text" : ""} href="https://www.instagram.com/exposure.explorers.nitg/" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', animationDelay: animationsReady ? `${BASE_DELAY_MS + 760}ms` : '0ms', textDecoration: 'none' }}>Instagram</a>
          <a className={animationsReady ? "cu-mobile-text" : ""} href="https://www.linkedin.com/company/exposure-explorers" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', animationDelay: animationsReady ? `${BASE_DELAY_MS + 820}ms` : '0ms', textDecoration: 'none' }}>Linkedin</a>
          <a className={animationsReady ? "cu-mobile-text" : ""} href="https://www.youtube.com/@Exposure-Explorers" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', animationDelay: animationsReady ? `${BASE_DELAY_MS + 880}ms` : '0ms', textDecoration: 'none' }}>Youtube</a>
        </div>
        {submitMsg && (
          <div className={animationsReady ? "cu-mobile-text" : ""} style={{ animationDelay: animationsReady ? `${BASE_DELAY_MS + 700}ms` : '0ms', fontFamily: "'PP Editorial New', serif", fontSize: 16, color: '#000' }}>
            {submitMsg}
          </div>
        )}
      </div>
    </div>
    </>
  );
}


