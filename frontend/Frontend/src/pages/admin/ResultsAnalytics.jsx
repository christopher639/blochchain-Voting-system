import { useEffect, useState } from 'react'
import { fetchVotes, fetchCandidates } from '../../lib/api'
import Sparkline from '../../components/Sparkline'

function BarChart({ buckets = [], labels = [] }){
  const max = Math.max(...buckets, 1)
  return (
    <div className="w-full h-48 flex items-end gap-2">
      {buckets.map((v,i)=> (
        <div key={i} className="flex-1">
          <div className="bg-blue-600 rounded-t" style={{ height: `${(v/max)*100}%` }} />
          <div className="text-xs text-center mt-1">{labels[i] ?? ''}</div>
        </div>
      ))}
    </div>
  )
}

function PieChart({ data = [] }){
  const total = data.reduce((s,d)=>s+d.value,0) || 1
  let angle = 0
  const cx = 60, cy = 60, r = 50
  return (
    <svg width={140} height={140} viewBox={`0 0 140 140`}>
      {data.map((d,i)=>{
        const portion = d.value / total
        const start = angle * Math.PI*2
        angle += portion
        const end = angle * Math.PI*2
        const x1 = cx + r * Math.cos(start)
        const y1 = cy + r * Math.sin(start)
        const x2 = cx + r * Math.cos(end)
        const y2 = cy + r * Math.sin(end)
        const large = portion > 0.5 ? 1 : 0
        const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`
        return <path key={i} d={path} fill={d.color} stroke="#fff" />
      })}
    </svg>
  )
}

export default function ResultsAnalytics(){
  const [votes, setVotes] = useState([])
  const [candidates, setCandidates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [positionFilter, setPositionFilter] = useState('all')

  useEffect(()=>{
    setLoading(true)
    Promise.all([fetchVotes(), fetchCandidates()])
      .then(([v,c])=>{
        setVotes(v)
        setCandidates(c)
      })
      .catch(err=>{
        console.error('Results load error', err)
        setError('Unable to load results')
      })
      .finally(()=>setLoading(false))
  },[])

  const positions = Array.from(new Set((candidates||[]).map(c=>c.position))).filter(Boolean)

  const filteredCandidates = candidates.filter(c=> positionFilter==='all' ? true : c.position === positionFilter)

  // compute counts per candidate
  const counts = filteredCandidates.map(c=>({ candidate: c, count: votes.filter(v=>v.choice===c._id).length }))

  // build pie data
  const pieData = counts.map((c,i)=>({ value: c.count, color: ['#2563eb','#ef4444','#f59e0b','#10b981'][i % 4], label: c.candidate.name }))

  // build bar buckets by candidate
  const barBuckets = counts.map(c=>c.count)
  const labels = counts.map(c=>c.candidate.name)

  return (
    <div>
      <h1 className="text-2xl font-semibold">Results & Analytics</h1>
      <div className="mt-4 bg-white p-4 rounded shadow">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Vote counts per position and turnout analytics.</p>
          <div className="flex items-center gap-2">
            <select value={positionFilter} onChange={e=>setPositionFilter(e.target.value)} className="border px-2 py-1 rounded">
              <option value="all">All positions</option>
              {positions.map(p=> <option key={p} value={p}>{p}</option>)}
            </select>
            <button onClick={()=>{
              // export CSV quick
              const rows = [['candidate','position','votes'], ...counts.map(c=>[c.candidate.name, c.candidate.position, c.count])]
              const csv = rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
              const blob = new Blob([csv], { type: 'text/csv' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'results.csv'
              a.click()
            }} className="btn btn-outline">Export CSV</button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading results…</div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">{error}</div>
        ) : (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded">
              <h3 className="font-medium mb-2">Top candidates</h3>
              {counts.length === 0 && <div className="text-sm text-gray-400">No data for selected position</div>}
              {counts.map(c => (
                <div key={c.candidate._id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-medium">{c.candidate.name}</div>
                    <div className="text-xs text-gray-500">{c.candidate.position}</div>
                  </div>
                  <div className="text-sm font-semibold">{c.count}</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded">
              <h3 className="font-medium mb-2">Charts</h3>
              <div className="mb-4">
                <BarChart buckets={barBuckets} labels={labels} />
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <PieChart data={pieData} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium">Trend</h4>
                  <div className="mt-2"><Sparkline data={votes.slice(-20).map(v=>1)} width={300} height={48} /></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
