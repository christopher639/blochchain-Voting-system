import { useState, useEffect } from 'react'
import api from '../../lib/api'
import LoadingSpinner from '../../components/auth/LoadingSpinner'

export default function ManageVoters(){
  const [voters, setVoters] = useState([])
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    setError(null)
    try{
      const all = await api.fetchVoters()
      setVoters(all || [])
      const p = await api.fetchPendingVoters()
      setPending(p || [])
    } catch (err) {
      console.error('Failed to load voters:', err)
      setError('Failed to load voter data')
    } finally{ setLoading(false) }
  }

  async function approve(id){
    try{
      const res = await api.approveVoter(id)
      if (res && res.success) load(); else alert(res.error || 'Failed')
    }catch(err){ alert(err.message) }
  }

  async function reject(id){
    try{
      const res = await api.rejectVoter(id)
      if (res && res.success) load(); else alert(res.error || 'Failed')
    }catch(err){ alert(err.message) }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Registered Voters</h1>
      
      {loading ? (
        <div className="mt-4 p-12 bg-white rounded shadow flex flex-col items-center justify-center gap-4">
          <LoadingSpinner size={40} />
          <p className="text-gray-600">Loading voters...</p>
        </div>
      ) : error ? (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded shadow border border-red-200">
          <p className="mb-3">{error}</p>
          <button onClick={load} className="px-4 py-2 bg-red-600 text-white rounded">Retry</button>
        </div>
      ) : (
        <div>
          <div className="mt-4 bg-white p-4 rounded shadow">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-gray-500"><tr><th>Img</th><th>Name</th><th>Student ID</th><th>Email</th><th>Status</th><th>Registered</th><th>Actions</th></tr></thead>
              <tbody>
                {voters.map(u => (
                  <tr key={u._id} className="border-t">
                    <td className="py-2"><img src={u.profileImage || '/uploads/placeholder.png'} className="h-8 w-8 rounded object-cover"/></td>
                    <td className="py-2">{u.fullName || u.username}</td>
                    <td className="py-2">{u.studentId || '-'}</td>
                    <td className="py-2">{u.email || '-'}</td>
                    <td className="py-2">{u.registrationStatus}</td>
                    <td className="py-2">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="py-2">View</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold mt-6">Pending Registrations</h2>
          <div className="mt-2 bg-white p-4 rounded shadow">
            {pending.length === 0 ? <div className="text-sm text-gray-600">No pending registrations</div> : (
              <table className="w-full text-sm">
                <thead className="text-left text-xs text-gray-500"><tr><th>Img</th><th>Name</th><th>Student ID</th><th>Email</th><th>Submitted</th><th>Actions</th></tr></thead>
                <tbody>
                  {pending.map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="py-2"><img src={u.profileImage || '/uploads/placeholder.png'} className="h-8 w-8 rounded object-cover"/></td>
                      <td className="py-2">{u.fullName || u.username}</td>
                      <td className="py-2">{u.studentId || '-'}</td>
                      <td className="py-2">{u.email || '-'}</td>
                      <td className="py-2">{new Date(u.createdAt).toLocaleString()}</td>
                      <td className="py-2">
                        <button onClick={()=>approve(u._id)} className="mr-2 px-2 py-1 bg-green-600 text-white rounded">Approve</button>
                        <button onClick={()=>reject(u._id)} className="px-2 py-1 bg-red-600 text-white rounded">Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
 
