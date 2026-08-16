import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

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

export default function AdminSidebar({ isOpen, onClose }){
  const loc = useLocation()
  
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 lg:hidden z-30"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-white border-r z-40
        transform transition-transform duration-300 lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        <div className="p-4 border-b flex items-center gap-3">
          <img src="/public/ug-logo.png" alt="UG" className="h-12 w-12 object-contain shrink-0" onError={(e)=>{e.target.style.display='none'}} />
          <div>
            <div className="text-base font-semibold">Administration</div>
            <div className="text-xs muted">Election Portal</div>
          </div>
        </div>

        <nav className="p-4 flex-1 overflow-auto space-y-1">
          {adminItems.map(i=> (
            <Link 
              key={i.to} 
              to={i.to}
              onClick={onClose}
              className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                loc.pathname.startsWith(i.to) 
                  ? 'bg-slate-100 font-medium text-gray-900' 
                  : 'text-gray-700 hover:bg-slate-50'
              }`}>
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t text-xs muted">Admin • Secure Access</div>
      </aside>
    </>
  )
}

