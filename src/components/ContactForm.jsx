import { useState } from 'react'

function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to send')
      setStatus('Sent!')
      setName(''); setEmail(''); setMessage('')
    } catch (err) {
      setStatus(err.message)
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
      <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required />
      <textarea placeholder="Message" value={message} onChange={e => setMessage(e.target.value)} required />
      <button type="submit">Send</button>
      {status && <p>{status}</p>}
    </form>
  )
}

export default ContactForm


