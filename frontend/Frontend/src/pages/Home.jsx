import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../lib/api'
import LiveVoting from '../components/LiveVoting'
import { parseJwt } from '../lib/auth'

export default function Home() {
  const navigate = useNavigate()
  const [hasVoted, setHasVoted] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      // Check if voter has already voted
      checkVotingStatus()
    } else {
      setIsLoggedIn(false)
      setHasVoted(null)
    }
  }, [])

  async function checkVotingStatus() {
    try {
      const token = localStorage.getItem('token')
      const parsed = parseJwt(token)
      const voterId = parsed?.id || localStorage.getItem('username')
      
      if (voterId) {
        const res = await api.checkVotingStatus(voterId)
        setHasVoted(res?.hasVoted || false)
      }
    } catch (err) {
      console.error('Failed to check voting status:', err)
      setHasVoted(false)
    }
  }

  async function handleCast() {
    if (isLoggedIn) {
      if (hasVoted) {
        return // Already voted message will show
      }
      // Go directly to ballot
      navigate('/vote/ballot')
    } else {
      // Go to login
      localStorage.setItem('postLogin', 'vote')
      navigate('/login')
    }
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-bold">University of Ghana — SRC Voting</h1>
          <p className="mt-4 text-lg muted">Secure, transparent, and verifiable electronic voting for student governance. Cast your vote confidently — results are recorded on an auditable blockchain ledger.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            {isLoggedIn && hasVoted ? (
              <div className="px-4 py-3 bg-green-50 border border-green-200 rounded text-green-700">
                <div className="font-medium">✓ You have already voted</div>
                <div className="text-sm">Your vote has been recorded. Thank you for participating in the election.</div>
              </div>
            ) : (
              <button 
                onClick={handleCast} 
                className="btn btn-primary"
                disabled={isLoggedIn && hasVoted === null}
              >
                {isLoggedIn && hasVoted === null ? 'Loading...' : 'Cast Your Vote'}
              </button>
            )}
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3">
            <div className="card">
              <div className="text-sm muted">Security</div>
              <div className="font-medium">End-to-end verifiable</div>
            </div>
            <div className="card">
              <div className="text-sm muted">Transparency</div>
              <div className="font-medium">Auditable blockchain log</div>
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <img src="/public/vote-illustration.png" alt="Voting illustration" className="w-full rounded" onError={(e)=>{e.target.style.display='none'}} />
            <div className="mt-4 text-sm muted">Quick, private, and secure voting experience designed for students.</div>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <LiveVoting />
      </div>
    </div>
  )
}
