import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import TextInput from '../components/auth/TextInput'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/auth/Button'
import Alert from '../components/auth/Alert'
import LoadingSpinner from '../components/auth/LoadingSpinner'
import { login, checkVotingStatus } from '../lib/api'
import { parseJwt } from '../lib/auth'

export default function Login(){
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function handle(e){
    e.preventDefault()
    setError(null)
    if (!identifier) return setError('Please enter your university email or student ID.')
    if (!password) return setError('Please enter your password.')
    setLoading(true)
    try{
      const res = await login(identifier, password)
      if (res && res.token){
        localStorage.setItem('token', res.token)
        localStorage.setItem('username', res.user?.name || identifier)
        if (remember) localStorage.setItem('remember', '1')
        
        const role = res.user?.role
        const post = localStorage.getItem('postLogin')
        
        // If going to vote, check if already voted
        if (post === 'vote' && role === 'voter') {
          try {
            const parsed = parseJwt(res.token)
            const voterId = parsed?.id || res.user?._id
            const voteStatus = await checkVotingStatus(voterId)
            
            if (voteStatus?.hasVoted) {
              localStorage.removeItem('postLogin')
              setError('You have already voted. You can only vote once.')
              localStorage.removeItem('token')
              localStorage.removeItem('username')
              setLoading(false)
              return
            }
          } catch (err) {
            console.error('Failed to check voting status:', err)
          }
        }
        
        localStorage.removeItem('postLogin')
        
        // success message briefly then redirect
        setTimeout(()=>{
          if (post === 'vote' && role === 'voter') navigate('/vote/ballot')
          else if (role === 'admin') navigate('/dashboard')
          else navigate('/')
        }, 400)
      } else {
        setError(res?.error || 'Invalid credentials. Please try again.')
      }
    }catch(err){
      setError('Login failed. Please try again.')
    }finally{ setLoading(false) }
  }

  const aside = (
    <div className="mt-6">
      <svg width="120" height="60" viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <rect x="4" y="6" width="28" height="28" rx="4" fill="#eef2ff" />
        <rect x="36" y="6" width="28" height="28" rx="4" fill="#eef2ff" />
        <rect x="68" y="6" width="28" height="28" rx="4" fill="#eef2ff" />
      </svg>
    </div>
  )

  return (
    <AuthLayout title="Sign in to your account" aside={aside}>
      {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
      <form onSubmit={handle}>
        <TextInput id="identifier" label="Email or Student ID" value={identifier} onChange={setIdentifier} placeholder="example@ug.edu.gh or 12345678" required autoComplete="username" />
        <PasswordInput id="password" label="Password" value={password} onChange={setPassword} required hint="Your university password" />
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)} /> Remember me</label>
          <Link to="/auth/forgot" className="text-sm text-blue-600">Forgot password?</Link>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" primary disabled={loading}>{loading ? <><LoadingSpinner size={14}/> Logging in...</> : 'Login'}</Button>
          <Link to="/register" className="text-sm text-gray-600">Create account</Link>
        </div>
      </form>

      <div className="mt-6 text-xs text-gray-500">Secure Authentication — Your credentials are securely protected. Election Integrity measures applied.</div>
    </AuthLayout>
  )
}
