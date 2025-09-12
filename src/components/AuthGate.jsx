import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import styles from './AuthGate.module.css'

// Premium icon components
const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
  </svg>
)

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)

const ArrowLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
)

const LogOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16,17 21,12 16,7"/>
    <path d="M21 12H9"/>
  </svg>
)

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [phase, setPhase] = useState('request') // 'request' | 'verify'

  useEffect(() => {
    let mounted = true
    ;(async () => {
      const { data } = await supabase.auth.getUser()
      if (mounted) {
        setUser(data.user || null)
        setLoading(false)
      }
    })()
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user || null)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  const requestOtp = async (e) => {
    e.preventDefault()
    setStatus('Sending code...')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Sends both magic link and a 6-digit OTP to email
        shouldCreateUser: true,
      },
    })
    if (error) setStatus(error.message)
    else {
      setStatus('Code sent. Check your email and enter the 6-digit code.')
      setPhase('verify')
    }
  }

  const verifyOtp = async (e) => {
    e.preventDefault()
    setStatus('Verifying...')
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: code.trim(),
      type: 'email',
    })
    if (error) setStatus(error.message)
    else {
      setUser(data?.user || null)
      setStatus('Signed in')
      setPhase('request')
      setCode('')
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingCard}>
          <div className={styles.loadingIcon}>
            <div className={styles.spinner} />
          </div>
          <p className={styles.loadingText}>Initializing secure session</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <h1 className={styles.explosionExploders}>
              <span className={styles.explosion}>Explosion</span> Exploders
            </h1>
            <h1 className={styles.authTitle}>
              {phase === 'request' ? 'Lock it in, mate' : 'Verify Identity'}
            </h1>
            <p className={styles.authSubtitle}>
              {phase === 'request' 
                ? 'Whack your email in below and we’ll shoot you a code, easy peasy.'
                : 'Enter the 6-digit code sent to your email'
              }
            </p>
          </div>

          <div className={styles.authContent}>
            {phase === 'request' ? (
              <form onSubmit={requestOtp} className={styles.authForm}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>
                    <EmailIcon />
                  </div>
                  <input
                    type="email"
                    placeholder="you@exploders.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                    autoComplete="email"
                    autoFocus
                  />
                </div>
                <button type="submit" className={styles.primaryButton} disabled={!email.trim()}>
                  <EmailIcon />
                  <span>Hit me with the code</span>
                </button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className={styles.authForm}>
                <div className={styles.inputGroup}>
                  <div className={styles.inputIcon}>
                    <KeyIcon />
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Bang in that 6‑digit code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    required
                    className={`${styles.input} ${styles.codeInput}`}
                    autoComplete="one-time-code"
                    autoFocus
                    maxLength="6"
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={styles.primaryButton} disabled={code.length !== 6}>
                    <KeyIcon />
                    <span>Let me in</span>
                  </button>
                  <button 
                    type="button" 
                    className={styles.secondaryButton}
                    onClick={() => { setPhase('request'); setCode(''); setStatus('') }}
                  >
                    <ArrowLeftIcon />
                    <span>Back to email</span>
                  </button>
                </div>
              </form>
            )}

            {status && (
              <div className={`${styles.statusMessage} ${
                status.includes('sent') || status.includes('Signed in') 
                  ? styles.statusSuccess 
                  : status.includes('Sending') || status.includes('Verifying')
                  ? styles.statusLoading
                  : styles.statusError
              }`}>
                {status.includes('Sending') || status.includes('Verifying') ? (
                  <div className={styles.statusSpinner} />
                ) : null}
                <span>{status}</span>
              </div>
            )}
          </div>

          <div className={styles.authFooter}>
            <p className={styles.securityNote}>
              Don’t stress — we keep your stuff safe as houses.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.authenticatedContainer}>
      <header className={styles.userHeader}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.email.charAt(0).toUpperCase()}
          </div>
          <span className={styles.userEmail}>{user.email}</span>
        </div>
        <button onClick={signOut} className={styles.signOutButton} title="Sign out">
          <LogOutIcon />
          <span>Sign Out</span>
        </button>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
}
