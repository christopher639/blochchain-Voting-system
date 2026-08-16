export default function AdminUsers(){
  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Settings / Users</h1>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div className="text-sm text-gray-500">Manage admin accounts and roles.</div>
        <table className="w-full text-sm mt-3">
          <thead className="text-left text-xs text-gray-500"><tr><th>Name</th><th>Role</th><th>Last Activity</th><th>Actions</th></tr></thead>
          <tbody>
            <tr className="border-t"><td>Admin User</td><td>Super Admin</td><td>2026-08-10</td><td>Edit / Revoke</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
