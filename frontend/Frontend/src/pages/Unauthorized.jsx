import { Link } from 'react-router-dom'
import AuthLayout from '../components/auth/AuthLayout'
import Button from '../components/auth/Button'

export default function Unauthorized(){
  return (
    <AuthLayout title="Access denied">
      <div className="mb-4 text-sm text-gray-700">You do not have permission to view this page.</div>
      <div className="flex items-center gap-3">
        <Button primary><Link to="/login">Sign in</Link></Button>
        <Button><Link to="/">Return home</Link></Button>
      </div>
    </AuthLayout>
  )
}
