const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://blockchainvms-backend.onrender.com'
const API_BASE = BACKEND.replace(/\/$/, '')

function normalizeCandidate(candidate){
  if (!candidate) return candidate
  const positionObj = candidate.position && typeof candidate.position === 'object' ? candidate.position : null
  const imageUrl = candidate.imageUrl
    ? (candidate.imageUrl.startsWith('http') ? candidate.imageUrl : `${API_BASE}${candidate.imageUrl}`)
    : '/uploads/placeholder.png'

  const runningMate = candidate.runningMate && typeof candidate.runningMate === 'object'
    ? {
        ...candidate.runningMate,
        imageUrl: candidate.runningMate.imageUrl
          ? (candidate.runningMate.imageUrl.startsWith('http') ? candidate.runningMate.imageUrl : `${API_BASE}${candidate.runningMate.imageUrl}`)
          : '/uploads/placeholder.png'
      }
    : candidate.runningMate || null

  return {
    ...candidate,
    position: positionObj ? positionObj.name : (candidate.position ?? null),
    positionId: positionObj ? positionObj._id : (candidate.positionId ?? candidate.position ?? null),
    imageUrl,
    runningMate
  }
}

function normalizeUser(user){
  if (!user) return user
  return {
    ...user,
    profileImage: user.profileImage
      ? (user.profileImage.startsWith('http') ? user.profileImage : `${API_BASE}${user.profileImage}`)
      : '/uploads/placeholder.png'
  }
}

async function submitVote(vote){
  const token = localStorage.getItem('token')
  const res = await fetch(`${BACKEND}/api/votes`, {
    method: 'POST', headers: { 'Content-Type':'application/json', ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(vote)
  })
  return res.json()
}

async function fetchVotes(){ const res = await fetch(`${BACKEND}/api/votes`); return res.json() }
async function fetchCandidates(){ const res = await fetch(`${BACKEND}/api/candidates`); const items = await res.json(); return (items || []).map(normalizeCandidate) }
async function fetchPositions(){ const res = await fetch(`${BACKEND}/api/positions`); return res.json() }
async function createPosition(data){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/positions`, { method: 'POST', headers: { 'Content-Type':'application/json', ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: JSON.stringify(data) }); return res.json() }

async function fetchVoters(){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/voters`, { headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) } }); const users = await res.json(); return (users || []).map(normalizeUser) }
async function fetchPendingVoters(){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/voters/pending`, { headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) } }); const users = await res.json(); return (users || []).map(normalizeUser) }
async function approveVoter(id){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/voters/${id}/approve`, { method: 'POST', headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) } }); return res.json() }
async function rejectVoter(id){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/voters/${id}/reject`, { method: 'POST', headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) } }); return res.json() }
async function registerVoter(formData){ const res = await fetch(`${BACKEND}/api/voters/register`, { method: 'POST', body: formData }); return res.json() }

async function updateCandidate(id, formData){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/candidates/${id}`, { method: 'PUT', headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: formData }); return res.json() }
async function deleteCandidate(id){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/candidates/${id}`, { method: 'DELETE', headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) } }); return res.json() }

async function fetchStats(){ const res = await fetch(`${BACKEND}/api/stats`); return res.json() }

async function register(username, password, role='voter'){ const res = await fetch(`${BACKEND}/api/auth/register`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password, role }) }); return res.json() }
async function login(username, password){ const res = await fetch(`${BACKEND}/api/auth/login`, { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify({ username, password }) }); return res.json() }

async function createCandidate(formData){ const token = localStorage.getItem('token'); const res = await fetch(`${BACKEND}/api/candidates`, { method: 'POST', headers: { ...(token?{ Authorization: `Bearer ${token}` }: {}) }, body: formData }); return res.json() }

export { submitVote, fetchVotes, fetchCandidates, fetchPositions, createPosition, fetchVoters, fetchPendingVoters, approveVoter, rejectVoter, registerVoter, updateCandidate, deleteCandidate, fetchStats, register, login, createCandidate }

export default { submitVote, fetchVotes, fetchCandidates, fetchPositions, createPosition, fetchVoters, fetchPendingVoters, approveVoter, rejectVoter, registerVoter, updateCandidate, deleteCandidate, fetchStats, register, login, createCandidate }
