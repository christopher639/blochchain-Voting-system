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

export function isAdmin(){
  const token = localStorage.getItem('token')
  const p = parseJwt(token)
  return p && p.role === 'admin'
}
