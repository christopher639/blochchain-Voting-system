import AdminTopbar from '../components/admin/AdminTopbar'
import AdminSidebar from '../components/admin/AdminSidebar'

export default function AdminLayout({ children }){
  const adminName = localStorage.getItem('username') || 'Administrator'
  return (
    <div className="min-h-screen flex bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminTopbar adminName={adminName} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
