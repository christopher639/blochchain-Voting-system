import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import TextInput from '../components/auth/TextInput'
import Button from '../components/auth/Button'
import Alert from '../components/auth/Alert'
// no named `fetch` export in `lib/api.js` — use global `fetch` or api helpers

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function handle(e){
    e.preventDefault()
    setError(null); setMessage(null)
    if (!email || !email.includes('@')) return setError('Please enter a valid university email.')
    try{
      // attempt endpoint if present
      await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://blockchainvms-backend.onrender.com'}/api/auth/forgot`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email }) })
      setMessage('If an account exists, a password reset link has been sent to your email.')
    }catch(err){
      setError('Failed to request password reset. Try again later.')
    }
  }

  const aside = null

  return (
    <AuthLayout title="Forgot Password" aside={aside}>
      {message && <div className="mb-4"><Alert>{message}</Alert></div>}
      {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
      <form onSubmit={handle}>
        <TextInput id="email" label="University email" value={email} onChange={setEmail} required autoComplete="email" />
        <div className="flex items-center gap-3">
          <Button type="submit" primary>Request reset</Button>
          <Link to="/login" className="text-sm text-gray-600">Back to login</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
