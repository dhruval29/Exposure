import styles from './ContactUs.module.css';
import React from 'react';
import { supabase } from '../lib/supabaseClient';


const ContactUs = () => {
	const [form, setForm] = React.useState({
		name: '',
		phone: '',
		email: '',
		eventAbout: '',
		eventWhen: ''
	});

	const [submitting, setSubmitting] = React.useState(false);
	const [submitMsg, setSubmitMsg] = React.useState('');

	const handleChange = (field) => (e) => {
		setForm(prev => ({ ...prev, [field]: e.target.value }));
	};

	const handleSubmit = async () => {
		if (submitting) return;
		setSubmitMsg('');
		// basic validation
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
				event_when: form.eventWhen
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
		<div id="contact" className={styles.contactUs}>
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
				<div className={styles.contactUsInner} />
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
				<input
					className={styles.inputEventWhen}
					type="text"
					value={form.eventWhen}
					onChange={handleChange('eventWhen')}
				/>
				<div className={styles.frameParent}>
						<div className={styles.exposureexplorersnitgoaaciWrapper}>
								<a className={styles.exposureexplorersnitgoaaci} href="mailto:exposure.explorers@nitgoa.ac.in" target="_blank">exposure.explorers@nitgoa.ac.in</a>
						</div>
						<div className={styles.instagram}>Instagram</div>
						<div className={styles.linkedin}>{`Linkedin `}</div>
						<div className={styles.youtube}>Youtube</div>
				</div>
				<div className={styles.reachUsWrapper}>
						<button className={styles.reachUs} type="button" onClick={handleSubmit} disabled={submitting}>
								<div className={styles.reachUs2}>{submitting ? 'Sending…' : 'Reach Us!'}</div>
						</button>
				</div>
				{submitMsg && <div className={styles.submitMsg}>{submitMsg}</div>}
		</div>);
};

export default ContactUs;


