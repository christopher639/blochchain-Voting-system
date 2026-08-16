import { useEffect, useState } from 'react'
import api from '../lib/api'

export default function Candidates(){
  const [items, setItems] = useState([])
  useEffect(()=>{ api.fetchCandidates().then(r=>setItems(r || [])) },[])

  return (
    <div className="container py-8">
      <div className="card">
        <h2 className="text-xl font-semibold">Candidates & Positions</h2>
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
      </div>
    </div>
  )
}
