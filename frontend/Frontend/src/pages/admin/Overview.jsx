import { useEffect, useState } from 'react'
import { fetchStats, fetchVotes, fetchCandidates } from '../../lib/api'
import Sparkline from '../../components/Sparkline'

function StatCard({ title, value, hint }){
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-2">{hint}</div>}
    </div>
  )
}

export default function AdminOverview(){
  const [stats, setStats] = useState({})
  const [votes, setVotes] = useState([])
  const [candidates, setCandidates] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(()=>{
    setLoading(true)
    setError(null)
    Promise.all([fetchStats(), fetchVotes(), fetchCandidates()])
      .then(([s,v,c])=>{
        setStats(s)
        setVotes(v)
        setCandidates(c)
      })
      .catch(err=>{
        console.error('Overview load error', err)
        setError('Failed to load overview data')
      })
      .finally(()=>setLoading(false))
  },[])

  const candidatesById = Object.fromEntries((candidates||[]).map(c=>[c._id, c]))

  const recent = (votes || []).slice().reverse().slice(0,6)

  const turnoutPct = stats.usersCount ? Math.round(((votes?.length||0) / stats.usersCount) * 100) : null

  // small sparkline data: votes per recent 8 buckets by time
  const sparkData = (()=>{
    if (!votes || votes.length === 0) return []
    const now = Date.now()
    const buckets = 8
    const span = 1000 * 60 * 60 * 24 // default bucket span (1 day)
    const counts = new Array(buckets).fill(0)
    const minT = Math.min(...votes.map(v=>v.timestamp || v.createdAt || 0))
    const maxT = Math.max(...votes.map(v=>v.timestamp || v.createdAt || Date.now()))
    const range = Math.max(1, maxT - minT)
    votes.forEach(v=>{
      const t = v.timestamp || v.createdAt || 0
      const idx = Math.min(buckets-1, Math.floor(((t - minT) / range) * buckets))
      if (idx >=0) counts[idx]++
    })
    return counts
  })()

  return (
    <div>
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="mt-6">
        {loading ? (
          <div className="p-4 bg-white rounded shadow">Loading overview…</div>
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded shadow">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Positions" value={stats.positionsCount ?? '—'} />
            <StatCard title="Candidates" value={stats.candidatesCount ?? candidates.length ?? '—'} />
            <StatCard title="Registered Voters" value={stats.usersCount ?? '—'} />
            <StatCard title="Turnout" value={turnoutPct != null ? `${turnoutPct}%` : '—'} hint={turnoutPct != null ? `${votes.length} votes cast` : ''} />
          </div>
        )}
      </div>
      

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-medium">Turnout (by time)</h2>
          <p className="text-sm text-gray-500 mt-2">Activity sparkline across recent votes.</p>
          <div className="mt-4">
            <div className="h-16">
              <Sparkline data={sparkData} width={600} height={48} />
            </div>
            <div className="mt-3 text-sm text-gray-500">{votes.length} total votes • last update just now</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-medium">Recent Votes</h2>
          <div className="mt-3 space-y-2">
            {recent.length === 0 && <div className="text-sm text-gray-400">No recent votes</div>}
            {recent.map(v => (
              <div key={v._id} className="flex items-start gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center text-sm text-gray-500">V</div>
                <div>
                  <div className="text-sm font-medium">{v.voterId}</div>
                  <div className="text-xs text-gray-500">{v.position} — {candidatesById[v.choice]?.name ?? 'Candidate'}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <a href="#/dashboard/results" className="text-sm text-blue-600">View all results</a>
          </div>
        </div>
      </div>
    </div>
  )
}
