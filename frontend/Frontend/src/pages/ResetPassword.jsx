import { useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/auth/Button'
import Alert from '../components/auth/Alert'

export default function ResetPassword(){
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  async function handle(e){
    e.preventDefault()
    setError(null); setMessage(null)
    if (!password || password.length < 8) return setError('Password must be at least 8 characters.')
    if (password !== confirm) return setError('Passwords do not match.')
    setLoading(true)
    try{
      await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://blockchainvms-backend.onrender.com'}/api/auth/reset`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ token, password }) })
      setMessage('Password reset successful. You may now log in.')
    }catch(err){ setError('Failed to reset password.') }
    finally{ setLoading(false) }
  }

  return (
    <AuthLayout title="Reset password">
      {message && <div className="mb-4"><Alert>{message}</Alert></div>}
      {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
      <form onSubmit={handle}>
        <PasswordInput id="password" label="New password" value={password} onChange={setPassword} required hint="At least 8 characters" />
        <PasswordInput id="confirm" label="Confirm password" value={confirm} onChange={setConfirm} required />
        <div className="flex items-center gap-3">
          <Button type="submit" primary disabled={loading}>{loading ? 'Saving...' : 'Save new password'}</Button>
          <Link to="/login" className="text-sm text-gray-600">Back to login</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
