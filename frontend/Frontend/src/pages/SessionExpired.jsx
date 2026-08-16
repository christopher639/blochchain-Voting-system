import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Button from '../components/auth/Button'

export default function SessionExpired(){
  return (
    <AuthLayout title="Session expired">
      <div className="mb-4 text-sm text-gray-700">Your session has expired. Please sign in again to continue.</div>
      <div className="flex items-center gap-3">
        <Button primary><a href="/login">Sign in</a></Button>
      </div>
    </AuthLayout>
  )
}
