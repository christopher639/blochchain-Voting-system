import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Button from '../components/auth/Button'
import Alert from '../components/auth/Alert'

export default function VerifyAccount(){
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(()=>{
    if (!token) return setStatus('missing')
    async function verify(){
      try{
        await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/auth/verify`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ token }) })
        setStatus('ok')
      }catch(err){ setError('Verification failed'); setStatus('error') }
    }
    verify()
  },[token])

  return (
    <AuthLayout title="Account verification">
      {status === 'loading' && <div className="mb-4"><Alert>Verifying your account…</Alert></div>}
      {status === 'missing' && <div className="mb-4"><Alert type="error">Verification token missing.</Alert></div>}
      {status === 'error' && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
      {status === 'ok' && <div className="mb-4"><Alert>Account verified. You may now <Link to="/login" className="text-blue-600">sign in</Link>.</Alert></div>}
    </AuthLayout>
  )
}
