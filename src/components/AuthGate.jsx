import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AuthGate({ children }) {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)

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

  const signIn = async (e) => {
    e.preventDefault()
    setStatus('Sending magic link...')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    })
    if (error) setStatus(error.message)
    else setStatus('Check your email for the sign-in link.')
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) return <div>Loading...</div>

  if (!user) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 16 }}>
        <h3>Sign in</h3>
        <form onSubmit={signIn}>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 12 }}
          />
          <button type="submit">Send magic link</button>
        </form>
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
