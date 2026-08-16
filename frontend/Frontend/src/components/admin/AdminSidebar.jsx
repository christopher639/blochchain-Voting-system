import { Link, useLocation } from 'react-router-dom'

const adminItems = [
  { to: '/dashboard/overview', label: 'Dashboard' },
  { to: '/dashboard/elections', label: 'Elections' },
  { to: '/dashboard/positions', label: 'Positions' },
  { to: '/dashboard/candidates', label: 'Candidates' },
  { to: '/dashboard/voters', label: 'Voters' },
  { to: '/dashboard/votes', label: 'Vote Management' },
  { to: '/dashboard/results', label: 'Results' },
  { to: '/dashboard/reports', label: 'Reports' },
  { to: '/dashboard/audit', label: 'Audit Logs' },
  { to: '/dashboard/settings', label: 'System Settings' },
]

export default function AdminSidebar(){
  const loc = useLocation()
  return (
    <aside className="w-72 bg-white border-r hidden lg:flex lg:flex-col">
      <div className="p-4 border-b flex items-center gap-3">
        <img src="/public/ug-logo.png" alt="UG" className="h-12 w-12 object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
        <div>
          <div className="text-base font-semibold">Administration</div>
          <div className="text-xs muted">Election Portal</div>
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-auto space-y-1">
        {adminItems.map(i=> (
          <Link key={i.to} to={i.to} className={`block py-2 px-3 rounded-md text-sm ${loc.pathname.startsWith(i.to) ? 'bg-slate-100 font-medium' : 'text-gray-700 hover:bg-slate-50'}`}>
            {i.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t text-xs muted">Admin • Secure Access</div>
    </aside>
  )
}
