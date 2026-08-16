import { useState, useEffect } from 'react'
import api from '../../lib/api'
import LoadingSpinner from '../../components/auth/LoadingSpinner'

export default function ManagePositions(){
  const [showModal, setShowModal] = useState(false)
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', displayOrder: 0, active: true })

  useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    setError(null)
    try{
      const items = await api.fetchPositions()
      setPositions(items || [])
    } catch (err) {
      console.error('Failed to load positions:', err)
      setError('Failed to load positions')
    } finally { setLoading(false) }
  }

  async function save(){
    if (!form.name) return alert('Position name required')
    setLoading(true)
    try{
      const res = await api.createPosition(form)
      if (res && res._id) {
        setShowModal(false)
        setForm({ name: '', description: '', displayOrder: 0, active: true })
        load()
      } else {
        alert(res.error || 'Failed to save')
      }
    }catch(err){ alert(err.message) }
    finally{ setLoading(false) }
  }

  async function toggleActive(id, current){
    try{
      await api.createPosition({})
      // PUT endpoint exists; use fetch directly
      const token = localStorage.getItem('token')
      const res = await fetch((import.meta.env.VITE_BACKEND_URL||'https://blockchainvms-backend.onrender.com')+`/api/positions/${id}`, { method: 'PUT', headers: { 'Content-Type':'application/json', ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify({ active: !current }) })
      const data = await res.json()
      if (data.error) alert(data.error)
      load()
    }catch(err){ alert(err.message) }
  }

  async function remove(id){
    if (!confirm('Delete this position? This cannot be undone if candidates are removed.')) return
    try{
      const token = localStorage.getItem('token')
      const res = await fetch((import.meta.env.VITE_BACKEND_URL||'https://blockchainvms-backend.onrender.com')+`/api/positions/${id}`, { method: 'DELETE', headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) } })
      const data = await res.json()
      if (data.error) alert(data.error)
      load()
    }catch(err){ alert(err.message) }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Positions</h1>
        <button onClick={()=>setShowModal(true)} className="bg-blue-600 text-white px-3 py-2 rounded">Add New Position</button>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-4">
            <LoadingSpinner size={40} />
            <p className="text-gray-600">Loading positions...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded border border-red-200">
            <p className="mb-3">{error}</p>
            <button onClick={load} className="px-4 py-2 bg-red-600 text-white rounded">Retry</button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-gray-500">
              <tr><th>Name</th><th># Candidates</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {positions.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.candidateCount ?? 0}</td>
                  <td className="py-2">{p.active ? <span className="text-green-700">Active</span> : <span className="text-gray-600">Inactive</span>}</td>
                  <td className="py-2">
                    <button onClick={()=>toggleActive(p._id, p.active)} className="mr-2 text-sm">{p.active ? 'Deactivate' : 'Activate'}</button>
                    <button onClick={()=>remove(p._id)} className="text-sm text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="font-medium">Add Position</h2>
            <form className="mt-4 space-y-2" onSubmit={e=>{ e.preventDefault(); save() }}>
              <input className="w-full border p-2 rounded" placeholder="Position title" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
              <textarea className="w-full border p-2 rounded" placeholder="Description" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
              <input className="w-full border p-2 rounded" placeholder="Display order" type="number" value={form.displayOrder} onChange={e=>setForm({...form, displayOrder: Number(e.target.value)})} />
              <div className="flex items-center gap-2">
                <label className="text-sm">Active</label>
                <input type="checkbox" checked={form.active} onChange={e=>setForm({...form, active: e.target.checked})} />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={()=>setShowModal(false)} className="px-3 py-1">Cancel</button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
