import React from 'react';
import './ContactUsMobile.css';
import { supabase } from '../lib/supabaseClient';

function LabelWithLine({ label, delayMs = 0 }) {
  return (
    <div style={{ width: '100%' }}>
      <label className="cu-mobile-text" style={{ display: 'block', fontFamily: "'PP Editorial New', serif", fontSize: 20, color: '#000', marginBottom: '1.5vw', animationDelay: `${delayMs}ms` }}>
        {label}
      </label>
      <div className="cu-mobile-line" style={{ borderBottom: '1px solid #000', width: '100%', height: 1, animationDelay: `${delayMs}ms` }} />
    </div>
  );
}

export default function ContactUsMobile() {
  const [form, setForm] = React.useState({ name: '', phone: '', email: '', eventAbout: '', eventWhen: '' });
  const [submitting, setSubmitting] = React.useState(false);
  const [submitMsg, setSubmitMsg] = React.useState('');

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
      setSubmitMsg('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div style={{ backgroundColor: '#c9d5f7', minHeight: '100vh', padding: '3px 6vw' }}>
      <div style={{ marginBottom: '7vh' }}>
        <h1 className="cu-mobile-text" style={{ fontFamily: "'PP Editorial New', serif", fontStyle: 'italic', fontWeight: 400, fontSize: 64, color: '#000', lineHeight: 1, marginTop: '2vh', marginBottom: 16 }}>
          Contact
        </h1>
        <div className="cu-mobile-line" style={{ width: '100%', height: 1, backgroundColor: '#000', marginBottom: '3vh' }} />
        <div style={{ textAlign: 'center' }}>
          <p className="cu-mobile-text" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 24, color: '#000', lineHeight: 1.5, marginBottom: 4, animationDelay: '120ms' }}>
            Want help covering a event ?
          </p>
          <p className="cu-mobile-text" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 24, color: '#000', lineHeight: 1.5, animationDelay: '200ms' }}>
            Reach out using the form below!
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '4vw', marginBottom: '10vh' }}>
        <div className="cu-mobile-text" style={{ animationDelay: '240ms' }}>
          <LabelWithLine delayMs={240} label={"Your Name (or your Club's)"} />
          <input
            type="text"
            value={form.name}
            onChange={handleChange('name')}
            autoComplete="name"
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', padding: '0.4vh 0' }}
          />
        </div>
        <div className="cu-mobile-text" style={{ animationDelay: '320ms' }}>
          <LabelWithLine delayMs={320} label="Phone" />
          <input
            type="tel"
            value={form.phone}
            onChange={handleChange('phone')}
            autoComplete="tel"
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', padding: '0.4vh 0' }}
          />
        </div>
        <div className="cu-mobile-text" style={{ animationDelay: '380ms' }}>
          <LabelWithLine delayMs={380} label="Email" />
          <input
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            autoComplete="email"
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', padding: '0.4vh 0' }}
          />
        </div>
        <div className="cu-mobile-text" style={{ animationDelay: '440ms' }}>
          <LabelWithLine delayMs={440} label={"What's the event about?"} />
          <input
            type="text"
            value={form.eventAbout}
            onChange={handleChange('eventAbout')}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', padding: '0.4vh 0' }}
          />
        </div>
        <div className="cu-mobile-text" style={{ animationDelay: '500ms' }}>
          <LabelWithLine delayMs={500} label={"When's the Event?"} />
          <input
            type="text"
            value={form.eventWhen}
            onChange={handleChange('eventWhen')}
            style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', padding: '0.4vh 0' }}
          />
        </div>

        <div className="cu-mobile-text" style={{ display: 'flex', justifyContent: 'center', paddingTop: '2vh', animationDelay: '560ms' }}>
          <button onClick={handleSubmit} disabled={submitting}
            type="button"
            style={{ backgroundColor: '#112a46', borderRadius: 18, padding: '2vh 4vw', width: '100%', maxWidth: '40vw', textAlign: 'center' }}
          >
            <span style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#fff', lineHeight: 1.5 }}>{submitting ? 'Sending…' : 'Reach Us!'}</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', rowGap: '4vw' }}>
        <div className="cu-mobile-text" style={{ textAlign: 'center', animationDelay: '700ms' }}>
          <a
            href="mailto:exposure.explorers@nitgoa.ac.in"
            style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', textDecoration: 'underline', cursor: 'pointer' }}
          >
            exposure.explorers@nitgoa.ac.in
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3vw', textAlign: 'center' }}>
          <div className="cu-mobile-text" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', animationDelay: '760ms' }}>Instagram</div>
          <div className="cu-mobile-text" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', animationDelay: '820ms' }}>Linkedin</div>
          <div className="cu-mobile-text" style={{ fontFamily: "'PP Editorial New', serif", fontSize: 18, color: '#000', animationDelay: '880ms' }}>Youtube</div>
        </div>
        {submitMsg && (
          <div className="cu-mobile-text" style={{ animationDelay: '700ms', fontFamily: "'PP Editorial New', serif", fontSize: 16, color: '#000' }}>
            {submitMsg}
          </div>
        )}
      </div>
    </div>
  );
}


