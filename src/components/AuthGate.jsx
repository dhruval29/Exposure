import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

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

  if (loading) return <div>Loading...</div>

  if (!user) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
        <h3>Sign in</h3>
        {phase === 'request' ? (
          <form onSubmit={requestOtp}>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 12 }}
            />
            <button type="submit">Send code</button>
          </form>
        ) : (
          <form onSubmit={verifyOtp}>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter 6-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              style={{ width: '100%', marginBottom: 12, letterSpacing: 2 }}
            />
            <button type="submit">Verify</button>
            <button type="button" style={{ marginLeft: 8 }} onClick={() => { setPhase('request'); setCode(''); setStatus('') }}>Resend</button>
          </form>
        )}
        {status && <p style={{ marginTop: 12 }}>{status}</p>}
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'flex-end', padding: '8px 16px' }}>
        <span style={{ opacity: 0.7 }}>Signed in as {user.email}</span>
        <button onClick={signOut}>Sign out</button>
      </div>
      {children}
    </div>
  )
}
