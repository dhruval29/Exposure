import styles from './ContactUs.module.css'


const ContactUs = () => {
	return (
		<div className={styles.contactUs}>
				<div className={styles.fromGoaWithContainer}>
						<p className={styles.fromGoa}>From Goa,</p>
						<p className={styles.fromGoa}>
								<span>With Love.</span>
								<b className={styles.b}>{` `}</b>
						</p>
				</div>
				<img className={styles.contactUsChild} alt="Gmail" src="/assets/icons/arrowwithline.svg" />
				<div className={styles.gmail}>Gmail</div>
				<img className={styles.contactUsItem} alt="Instagram" src="/assets/icons/arrowwithline.svg" />
				<div className={styles.instagram}>Instagram</div>
				<img className={styles.contactUsInner} alt="Youtube" src="/assets/icons/arrowwithline.svg" />
				<div className={styles.youtube}>Youtube</div>
				<img className={styles.groupIcon} alt="Linkedin" src="/assets/icons/arrowwithline.svg" />
				<div className={styles.linkedin}>{`Linkedin `}</div>
				<div className={styles.exposureExplorers}>
						<p className={styles.fromGoa}>{`EXPOSURE `}</p>
						<p className={styles.fromGoa}>EXPLORERS</p>
				</div>
		</div>);
};

export default ContactUs;


