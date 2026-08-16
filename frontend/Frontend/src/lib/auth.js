// small JWT helper for client-side role checks
export function parseJwt(token){
  if (!token) return null
  try{
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = parts[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch (e){
    return null
  }
}

export function isTokenExpired(token){
  const decoded = parseJwt(token)
  if (!decoded || !decoded.exp) return true
  return Date.now() >= decoded.exp * 1000
}

export function isAdmin(){
  const token = localStorage.getItem('token')
  const p = parseJwt(token)
  return p && p.role === 'admin'
}

export function clearInvalidToken(){
  const token = localStorage.getItem('token')
  if (!token || !parseJwt(token) || isTokenExpired(token)){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    return true
  }
  return false
}
