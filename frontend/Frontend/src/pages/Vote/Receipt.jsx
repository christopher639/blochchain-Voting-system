import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../lib/api'
import LoadingSpinner from '../../components/auth/LoadingSpinner'

export default function Receipt(){
  const [hash, setHash] = useState(null)
  const [selections, setSelections] = useState([])
  const [candidates, setCandidates] = useState([])
  const [votes, setVotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('receipt') // receipt, results
  const navigate = useNavigate()

  useEffect(()=>{
    load()
  },[])

  async function load(){
    setLoading(true)
    try {
      // Get voter's selections
      const votedCandidates = localStorage.getItem('votedCandidates')
      if (votedCandidates) {
        setSelections(JSON.parse(votedCandidates))
      }

      // Fetch all candidates and current votes for results
      const [candidateList, votesList] = await Promise.all([
        api.fetchCandidates(),
        api.fetchVotes()
      ])

      setCandidates(candidateList || [])
      setVotes(votesList || [])
    } catch (err) {
      console.error('Failed to load receipt data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Get vote counts per candidate
  const voteCountsByCandidate = candidates.reduce((acc, candidate) => {
    const count = votes.filter(v => v.choice === candidate._id).length
    acc[candidate._id] = count
    return acc
  }, {})

  // Group candidates and results by position
  const resultsByPosition = candidates.reduce((acc, candidate) => {
    const position = candidate.position?.name || candidate.position || 'Unassigned'
    if (!acc[position]) {
      acc[position] = []
    }
    acc[position].push({
      ...candidate,
      voteCount: voteCountsByCandidate[candidate._id] || 0
    })
    return acc
  }, {})

  // Sort candidates by vote count (descending)
  Object.keys(resultsByPosition).forEach(pos => {
    resultsByPosition[pos].sort((a, b) => b.voteCount - a.voteCount)
  })

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main receipt */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b mb-6">
              <button
                onClick={() => setActiveTab('receipt')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'receipt'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Your Receipt
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                  activeTab === 'results'
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Live Results
              </button>
            </div>

            {loading ? (
              <div className="p-8 flex flex-col items-center justify-center gap-4">
                <LoadingSpinner size={40} />
                <p className="text-gray-600">Loading results...</p>
              </div>
            ) : activeTab === 'receipt' ? (
              <div>
                {/* Success message */}
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex gap-3">
                    <div className="text-2xl">✓</div>
                    <div>
                      <div className="font-semibold text-green-900">Your vote has been recorded</div>
                      <div className="text-sm text-green-800">Thank you for voting! Your selections have been securely submitted.</div>
                    </div>
                  </div>
                </div>

                {/* Your selections */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Your Selections</h3>
                  <div className="space-y-3">
                    {selections.length > 0 ? (
                      selections.map((sel, idx) => {
                        const candidate = candidates.find(c => c._id === sel.candidateId)
                        return (
                          <div key={idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                            <img src={sel.candidateImage || '/uploads/placeholder.png'} alt="" className="h-12 w-12 rounded object-cover" />
                            <div className="flex-1">
                              <div className="font-medium">{sel.candidateName}</div>
                              <div className="text-sm text-gray-600">{sel.position}</div>
                            </div>
                            <div className="text-2xl">✓</div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-500">No selections found</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Live Results */}
                <h3 className="text-lg font-semibold mb-4">Live Voting Results</h3>
                <div className="space-y-8">
                  {Object.keys(resultsByPosition).length > 0 ? (
                    Object.entries(resultsByPosition).map(([position, positionCandidates]) => {
                      const totalVotes = positionCandidates.reduce((sum, c) => sum + c.voteCount, 0) || 1
                      return (
                        <div key={position}>
                          <h4 className="font-medium text-md mb-3">{position}</h4>
                          <div className="space-y-3">
                            {positionCandidates.map((candidate, idx) => {
                              const percentage = (candidate.voteCount / totalVotes) * 100
                              const isLeading = idx === 0 && candidate.voteCount > 0
                              return (
                                <div key={candidate._id}>
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2 flex-1">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-gray-700 shrink-0">
                                        {idx + 1}
                                      </div>
                                      <div>
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
                                      <div className="text-xs text-gray-400">{percentage.toFixed(1)}%</div>
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
                      )
                    })
                  ) : (
                    <p className="text-gray-500">No results yet</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Receipt Hash Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow rounded-lg p-6 sticky top-6">
            <h3 className="font-semibold mb-4">Vote Receipt</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 block mb-2">Confirmation</label>
                <div className="p-3 bg-green-50 rounded text-center">
                  <div className="text-3xl text-green-600">✓</div>
                  <div className="text-sm font-medium text-green-900 mt-2">Vote Submitted</div>
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">Receipt Hash</label>
                <div className="p-3 bg-slate-50 rounded text-center break-all">
                  <div className="font-mono text-xs text-gray-700">
                    {localStorage.getItem('lastVoteHash') || 'No hash available'}
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Save this for verification on the public ledger
                </p>
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-2">Statistics</label>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Votes:</span>
                    <span className="font-semibold">{votes.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Positions:</span>
                    <span className="font-semibold">{Object.keys(resultsByPosition).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Votes:</span>
                    <span className="font-semibold">{selections.length}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <button
                  onClick={() => {
                    localStorage.removeItem('votedSelections')
                    localStorage.removeItem('votedCandidates')
                    navigate('/')
                  }}
                  className="w-full btn btn-primary"
                >
                  Return Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
