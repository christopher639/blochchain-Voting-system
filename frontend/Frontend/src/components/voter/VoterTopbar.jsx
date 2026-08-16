import { useNavigate } from 'react-router-dom'

export default function VoterTopbar({ voterName }){
  const navigate = useNavigate()
  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white border-b">
      <div className="flex items-center gap-4">
        <img src="/assets/images/University_of_Ghana_(UG)_logo.jpg" alt="University of Ghana" className="h-12 w-12 object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
        <div>
          <div className="text-sm font-semibold">University of Ghana</div>
          <div className="text-xs muted">Electronic Voting System</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-medium">{voterName}</div>
          <div className="text-xs muted">Voter</div>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-sm">Help</button>
          <button onClick={handleLogout} className="px-3 py-1 border rounded text-sm">Logout</button>
        </div>
      </div>
    </header>
  )
}
