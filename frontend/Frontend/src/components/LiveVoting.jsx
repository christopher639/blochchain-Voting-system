import { useEffect, useState } from 'react'
import { fetchVotes, fetchCandidates } from '../lib/api'

export default function LiveVoting(){
  const [candidates, setCandidates] = useState([])
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)

  async function load(){
    try {
      const [v, c] = await Promise.all([fetchVotes(), fetchCandidates()])
      setVotes(v || [])
      setCandidates(c || [])
    } catch (err) {
      console.error('Failed to load live voting data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(load, 3000) // refresh every 3 seconds
    return () => clearInterval(interval)
  }, [])

  // Group candidates by position and count votes
  const standings = candidates.reduce((acc, candidate) => {
    const position = candidate.position?.name || candidate.position || 'Unassigned'
    if (!acc[position]) {
      acc[position] = []
    }
    const voteCount = votes.filter(v => v.choice === candidate._id).length
    acc[position].push({ ...candidate, voteCount })
    return acc
  }, {})

  // Sort each position by vote count
  Object.keys(standings).forEach(pos => {
    standings[pos].sort((a, b) => b.voteCount - a.voteCount)
  })

  if (loading) {
    return (
      <div className="bg-white p-6 rounded shadow text-center text-gray-500">
        Loading live results...
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-2">Live Voting Progress</h2>
      <p className="text-sm text-gray-500 mb-6">Real-time vote count by position. Updates every 3 seconds.</p>

      {Object.keys(standings).length === 0 ? (
        <div className="text-center text-gray-400 py-8">No candidates yet</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(standings).map(([position, candidates]) => (
            <div key={position}>
              <h3 className="font-semibold text-lg mb-3">{position}</h3>
              <div className="space-y-3">
                {candidates.map((candidate, idx) => {
                  const maxVotes = Math.max(...candidates.map(c => c.voteCount), 1)
                  const percentage = (candidate.voteCount / maxVotes) * 100
                  const isLeading = idx === 0 && candidate.voteCount > 0

                  return (
                    <div key={candidate._id}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 flex-1">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-semibold text-gray-700 shrink-0">
                            {idx + 1}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{candidate.name}</div>
                            {candidate.runningMate?.name && (
                              <div className="text-xs text-gray-500">+ {candidate.runningMate.name}</div>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-2">
                          <div className={`font-bold text-lg ${isLeading ? 'text-green-600' : 'text-gray-700'}`}>
                            {candidate.voteCount}
                          </div>
                          <div className="text-xs text-gray-400">
                            {percentage.toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            isLeading ? 'bg-green-500' : 'bg-blue-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {isLeading && (
                        <div className="text-xs text-green-600 font-semibold mt-1">🏆 Leading</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 pt-4 border-t text-xs text-gray-400 text-center">
        Total votes: {votes.length} • Last updated: just now
      </div>
    </div>
  )
}
