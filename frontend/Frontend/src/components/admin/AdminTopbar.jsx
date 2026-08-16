import { useNavigate } from 'react-router-dom'

export default function AdminTopbar({ adminName = 'Admin User', onMenuToggle }){
  const navigate = useNavigate()
  function handleLogout(){
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/login')
  }

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 bg-white border-b">
      <div className="flex items-center gap-4">
        {/* Hamburger menu for mobile */}
        <button 
          onClick={onMenuToggle}
          className="lg:hidden flex flex-col gap-1 p-2 hover:bg-gray-100 rounded"
          aria-label="Toggle menu"
        >
          <div className="w-5 h-0.5 bg-gray-700"></div>
          <div className="w-5 h-0.5 bg-gray-700"></div>
          <div className="w-5 h-0.5 bg-gray-700"></div>
        </button>

        <img src="/assets/images/University_of_Ghana_(UG)_logo.jpg" alt="University of Ghana" className="h-12 w-12 object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
        <div>
          <div className="text-sm font-semibold">University of Ghana</div>
          <div className="text-xs muted">Election Administration</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <nav className="hidden sm:flex gap-3 text-sm">
          <button className="px-2 py-1 text-sm">Notifications</button>
          <button className="px-2 py-1 text-sm">Settings</button>
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium">{adminName}</div>
            <div className="text-xs muted">Administrator</div>
          </div>
          <button onClick={handleLogout} className="px-3 py-1 border rounded text-sm">Logout</button>
        </div>
      </div>
    </header>
  )
}

