import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import TextInput from '../components/auth/TextInput'
import PasswordInput from '../components/auth/PasswordInput'
import Button from '../components/auth/Button'
import Alert from '../components/auth/Alert'
import LoadingSpinner from '../components/auth/LoadingSpinner'
import api from '../lib/api'

export default function Register(){
  const [fullName, setFullName] = useState('')
  const [studentId, setStudentId] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [profileImage, setProfileImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function validate(){
    if (!fullName) return 'Please enter your full name.'
    if (!studentId) return 'Please enter your Student ID.'
    if (!email || !email.includes('@')) return 'Please enter your university email.'
    if (!password || password.length < 8) return 'Password must be at least 8 characters.'
    if (password !== confirm) return 'Passwords do not match.'
    if (!agree) return 'You must accept the terms and conditions.'
    return null
  }

  async function handle(e){
    e.preventDefault()
    setError(null)
    const v = validate()
    if (v) return setError(v)
    setLoading(true)
    try{
      // submit registration (with optional profile image)
      const fd = new FormData()
      fd.append('fullName', fullName)
      fd.append('studentId', studentId)
      fd.append('email', email)
      fd.append('phone', phone)
      fd.append('username', email)
      fd.append('password', password)
      if (profileImage) fd.append('profileImage', profileImage)
      const res = await api.registerVoter(fd)
      if (res && res.success){
        // show pending notice
        setError(null)
        alert('Registration submitted. Your account will be reviewed by an administrator.')
        navigate('/login')
      } else {
        setError(res.error || 'Registration failed')
      }
    }catch(err){
      setError('Registration failed. Please try again.')
    }finally{setLoading(false)}
  }

  const aside = null

  return (
    <AuthLayout title="Create your account" aside={aside}>
      {error && <div className="mb-4"><Alert type="error">{error}</Alert></div>}
      <form onSubmit={handle}>
        <TextInput id="fullName" label="Full name" value={fullName} onChange={setFullName} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <TextInput id="studentId" label="Student ID" value={studentId} onChange={setStudentId} required />
          <TextInput id="phone" label="Phone (optional)" value={phone} onChange={setPhone} />
        </div>
        <TextInput id="email" label="University email" value={email} onChange={setEmail} required autoComplete="email" />
        <div className="mt-2">
          <label className="text-sm">Profile photo (optional)</label>
          <input type="file" accept="image/*" onChange={e=>{ const f = e.target.files[0]; if (f){ setProfileImage(f); setPreview(URL.createObjectURL(f)) } else { setProfileImage(null); setPreview(null) } }} />
          {preview && <img src={preview} className="h-20 w-20 rounded object-cover mt-2" />}
        </div>
        <PasswordInput id="password" label="Password" value={password} onChange={setPassword} required hint="At least 8 characters" />
        <PasswordInput id="confirm" label="Confirm password" value={confirm} onChange={setConfirm} required />

        <div className="flex items-center gap-2 mb-4">
          <input id="agree" type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
          <label htmlFor="agree" className="text-sm text-gray-600">I agree to the election terms and conditions.</label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" primary disabled={loading}>{loading ? <><LoadingSpinner size={14}/> Creating...</> : 'Create Account'}</Button>
          <Link to="/login" className="text-sm text-gray-600">Back to login</Link>
        </div>
      </form>
    </AuthLayout>
  )
}
