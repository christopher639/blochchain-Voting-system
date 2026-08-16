import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { parseJwt } from '../lib/auth'

export default function RequireVoter({ children }){
  const navigate = useNavigate()
  useEffect(()=>{
    const token = localStorage.getItem('token')
    const user = parseJwt(token)
    if (!user){
      navigate('/login')
    } else if (user.role !== 'voter'){
      navigate('/auth/unauthorized')
    }
  }, [navigate])
  return children
}
