import styles from './ContactUs.module.css';
import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Calendar24 } from '@/components/Calendar24';
import gsap from 'gsap';
import '../styles/Gallery.css';
import SimpleNav from './SimpleNav';
import useRouteTransitionReady from '../hooks/useRouteTransitionReady';


const ContactUs = () => {
  const [animationsReady, setAnimationsReady] = React.useState(() => {
    // If no transition is active or already halfway lifted, allow animations immediately
    if (!window.__routeTransitionActive) return true;
    return !!window.__routeTransitionHalfExit;
  });

  React.useEffect(() => {
    if (animationsReady) return;
    const onHalf = () => setAnimationsReady(true);
    window.addEventListener('route-transition-half-exit', onHalf);
    // Safety: if loader isn't active for some reason, enable after a short delay
    const fallback = setTimeout(() => setAnimationsReady(true), 3000);
    return () => {
      window.removeEventListener('route-transition-half-exit', onHalf);
      clearTimeout(fallback);
    };
  }, [animationsReady]);
	const [form, setForm] = React.useState({
		name: '',
		phone: '',
		email: '',
		eventAbout: '',
		eventWhen: ''
	});

		const [submitting, setSubmitting] = React.useState(false);
	const [submitMsg, setSubmitMsg] = React.useState('');

		const handleEmailCopy = async (e) => {
			e && e.preventDefault();
			try {
				await navigator.clipboard.writeText('exposure.explorers@nitgoa.ac.in');
				setSubmitMsg('Email copied to clipboard');
				setTimeout(() => setSubmitMsg(''), 2000);
			} catch (_) {
				setSubmitMsg('Could not copy email');
				setTimeout(() => setSubmitMsg(''), 2000);
			}
		};

	const handleChange = (field) => (e) => {
		const value = e.target.value;
		console.log(`Form field ${field} changed to:`, value);
		setForm(prev => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async () => {
		if (submitting) return;
		setSubmitMsg('');
		
		console.log('Form submission started with data:', form);
		
		// Enhanced validation
		const missingFields = [];
		if (!form.name.trim()) missingFields.push('Name');
		if (!form.phone.trim()) missingFields.push('Phone');
		if (!form.email.trim()) missingFields.push('Email');
		
		if (missingFields.length > 0) {
			const errorMsg = `Please fill in: ${missingFields.join(', ')}.`;
			console.log('Validation failed:', errorMsg);
			setSubmitMsg(errorMsg);
			return;
		}
		
		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(form.email)) {
			const errorMsg = 'Please enter a valid email address.';
			console.log('Email validation failed:', errorMsg);
			setSubmitMsg(errorMsg);
			return;
		}
		
		setSubmitting(true);
		console.log('Submitting to Supabase...');
		
		try {
			const dataToInsert = {
				name: form.name.trim(),
				phone: form.phone.trim(),
				email: form.email.trim(),
				event_about: form.eventAbout.trim(),
				event_when: form.eventWhen
			};
			
			console.log('Data to insert:', dataToInsert);
			
			const { error } = await supabase.from('event_contact_requests').insert(dataToInsert);
			
			if (error) {
				console.error('Supabase error:', error);
				throw error;
			}
			
			console.log('Form submitted successfully!');
			setSubmitMsg('Thanks! We will get back to you soon.');
			setForm({ name: '', phone: '', email: '', eventAbout: '', eventWhen: '' });
		} catch (e) {
			console.error('Submission error:', e);
			setSubmitMsg(`Submission failed: ${e.message || 'Please try again.'}`);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<>
			<SimpleNav />
            <div id="contact" className={`${styles.contactUs} ${animationsReady ? styles.animationsReady : ''}`}>
			{/* Removed component-specific loader */}
				<i className={styles.contact}>Contact</i>
				<div className={styles.wantHelpCoveringContainer}>
						<p className={styles.wantHelpCovering}>Want help covering a event ?</p>
						<p className={styles.wantHelpCovering}>Reach out using the form below!</p>
				</div>
				<div className={styles.contactUsChild} />
				<div className={styles.yourNameOr}>Your Name (or your Club’s)</div>
				<div className={styles.whatsTheEvent}>What’s the event about?</div>
				<div className={styles.contactUsItem} />
				<div className={styles.whensTheEvent}>When’s the Event?</div>
				<div className={styles.lineDiv} />
				<div className={styles.contactUsContactUsChild} />
				<div className={styles.contactUsChild2} />
				<div className={styles.pointOfContact}>Point of Contact - Phone</div>
				<div className={styles.email}>Email</div>

				{/* Invisible inputs aligned to lines */}
				<input
					className={styles.inputName}
					type="text"
					value={form.name}
					onChange={handleChange('name')}
					autoComplete="name"
				/>
				<input
					className={styles.inputPhone}
					type="tel"
					value={form.phone}
					onChange={handleChange('phone')}
					autoComplete="tel"
				/>
				<input
					className={styles.inputEmail}
					type="email"
					value={form.email}
					onChange={handleChange('email')}
					autoComplete="email"
				/>
				<input
					className={styles.inputEventAbout}
					type="text"
					value={form.eventAbout}
					onChange={handleChange('eventAbout')}
				/>
				<div className={styles.inputEventWhen}>
					<Calendar24
						value={form.eventWhen ? new Date(form.eventWhen) : undefined}
						onChange={(d) => setForm(prev => ({ ...prev, eventWhen: d ? new Date(d).toISOString() : '' }))}
					/>
				</div>
				<div className={styles.frameParent}>
						<div className={styles.exposureexplorersnitgoaaciWrapper}>
							<a
								className={styles.exposureexplorersnitgoaaci}
								href="#"
								onClick={handleEmailCopy}
								rel="noopener noreferrer"
							>
								exposure.explorers@nitgoa.ac.in
							</a>
						</div>
						<a className={styles.instagram} href="https://www.instagram.com/exposure.explorers.nitg/" target="_blank" rel="noopener noreferrer">Instagram</a>
						<a className={styles.linkedin} href="https://www.linkedin.com/company/exposure-explorers" target="_blank" rel="noopener noreferrer">{`Linkedin `}</a>
						<a className={styles.youtube} href="https://www.youtube.com/@Exposure-Explorers" target="_blank" rel="noopener noreferrer">Youtube</a>
				</div>
				<div className={styles.reachUsWrapper}>
						<button className={styles.reachUs} type="button" onClick={handleSubmit} disabled={submitting}>
								<div className={styles.reachUs2}>{submitting ? 'Sending…' : 'Reach Us!'}</div>
						</button>
				</div>
				{submitMsg && <div className={styles.submitMsg}>{submitMsg}</div>}
		</div>
		</>
	);
};

export default ContactUs;


