import { useEffect, useState } from 'react'
import api from '../lib/api'
import LoadingSpinner from '../components/auth/LoadingSpinner'

export default function Candidates(){
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const r = await api.fetchCandidates()
      setItems(r || [])
    } catch (err) {
      console.error('Failed to load candidates:', err)
      setError('Failed to load candidates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="container py-8">
      <div className="card">
        <h2 className="text-xl font-semibold">Candidates & Positions</h2>
        {loading ? (
          <div className="mt-6 p-12 flex flex-col items-center justify-center gap-4">
            <LoadingSpinner size={40} />
            <p className="text-gray-600">Loading candidates...</p>
          </div>
        ) : error ? (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded border border-red-200">
            <p className="mb-3">{error}</p>
            <button onClick={load} className="px-4 py-2 bg-red-600 text-white rounded">Retry</button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(c=> (
              <div key={c._id} className="card">
                <div className="flex items-center gap-3">
                  <img src={c.imageUrl || '/uploads/placeholder.png'} alt="" className="h-12 w-12 rounded object-cover" />
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-sm muted">{c.position?.name || c.position || '—'}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
