import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout(){
  const navigate = useNavigate()
  useEffect(()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('remember')
    navigate('/login')
  },[navigate])
  return null
}
