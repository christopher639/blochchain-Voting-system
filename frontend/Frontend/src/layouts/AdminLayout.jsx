import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'
import { useState } from 'react'

export default function AdminLayout({ children }){
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const adminName = localStorage.getItem('username') || 'Administrator'
  
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col">
        <AdminTopbar adminName={adminName} onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
