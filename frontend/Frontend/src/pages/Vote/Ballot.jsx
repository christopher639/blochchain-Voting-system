import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import { parseJwt } from '../../lib/auth'

export default function Ballot(){
  const [candidates, setCandidates] = useState([])
  const [positions, setPositions] = useState([])
  const [selection, setSelection] = useState({})
  const [showReview, setShowReview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(()=>{ load() },[])
  async function load(){
    const items = await api.fetchCandidates()
    const normalized = items || []
    setCandidates(normalized)

    const pos = Array.from(new Set(normalized.map(i => i.position?.name || i.position || 'Unassigned')))
    setPositions(pos)
  }

  function select(position, candidateId){
    setSelection(s=>({ ...s, [position]: candidateId }))
  }

  function getVoterId(){
    const token = localStorage.getItem('token')
    const p = parseJwt(token)
    return p?.id || localStorage.getItem('username') || 'anonymous'
  }

  async function submitAll(){
    const voterId = getVoterId()
    setSubmitting(true)
    try{
      for (const position of Object.keys(selection)){
        const choice = selection[position]
        await api.submitVote({ voterId, choice, position, timestamp: Date.now() })
      }
      // show success and navigate to receipt
      navigate('/vote/receipt')
    } catch (err){
      alert('Failed to submit votes')
    } finally { setSubmitting(false) }
  }

  return (
    <div className="container py-8">
      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">University of Ghana SRC Election</h2>
            <div className="text-sm muted">Status: Ongoing • Cast your votes below</div>
          </div>
          <div>
            <button className="btn btn-outline" onClick={()=>navigate('/')}>Home</button>
          </div>
        </div>

        <div className="mt-6 space-y-8">
          {positions.map(pos=> (
            <section key={pos}>
              <h3 className="text-lg font-medium">{pos}</h3>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.filter(c => (c.position?.name || c.position || 'Unassigned') === pos).map(c => {
                  const runningMate = c.runningMate || { name: 'No running mate assigned', imageUrl: '/uploads/placeholder.png' }
                  return (
                    <div key={c._id} className={`card p-4 border ${selection[pos]===c._id ? 'ring-2 ring-indigo-300' : ''}`}>
                      <div className="flex items-center gap-4">
                        <img src={c.imageUrl || '/uploads/placeholder.png'} alt={c.name} className="h-16 w-16 rounded object-cover" />
                        <div className="flex-1">
                          <div className="font-medium">{c.name}</div>
                          <div className="text-sm muted">{c.position?.name || c.position || 'Unassigned'}</div>
                          <div className="text-sm mt-2">{c.metadata?.description || ''}</div>
                        </div>
                        <div>
                          <input type="radio" name={pos} checked={selection[pos]===c._id} onChange={()=>select(pos, c._id)} />
                        </div>
                      </div>

                      <div className="mt-4 border-t pt-3">
                        <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-2">Running mate</div>
                        <div className="flex items-center gap-3">
                          <img src={runningMate.imageUrl || '/uploads/placeholder.png'} alt={runningMate.name} className="h-10 w-10 rounded-full object-cover border" />
                          <div className="text-sm font-medium text-gray-800">{runningMate.name || 'No running mate assigned'}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-outline" onClick={()=>setShowReview(true)} disabled={Object.keys(selection).length===0}>Review</button>
          <button className="btn btn-primary" onClick={()=>setShowReview(true)} disabled={Object.keys(selection).length===0}>Continue</button>
        </div>
      </div>

      {showReview && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h3 className="text-lg font-medium">Review Your Selections</h3>
            <div className="mt-4 space-y-3">
              {Object.keys(selection).map(pos=>{
                const cid = selection[pos]
                const c = candidates.find(x=>x._id===cid)
                return (
                  <div key={pos} className="flex items-center gap-3">
                    <img src={c?.imageUrl || '/uploads/placeholder.png'} className="h-10 w-10 rounded object-cover" />
                    <div>
                      <div className="font-medium">{pos}</div>
                      <div className="text-sm">{c?.name}</div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button className="px-3 py-1" onClick={()=>setShowReview(false)}>Back</button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={submitAll} disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Vote'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
