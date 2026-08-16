// Simple in-memory append-only ledger for prototype/demo purposes.
// Persists to window for HMR safety during development.

const globalKey = '__VG_LEDGER__'
if (!window[globalKey]) window[globalKey] = { votes: [] }

const ledger = window[globalKey]

function hash(obj){
  return btoa(JSON.stringify(obj)).slice(0,32)
}

export function addVote(vote){
  const entry = { ...vote }
  // ensure position exists (default single 'president')
  entry.position = entry.position || 'president'
  // prevent double-vote for same voter and position
  const existing = ledger.votes.find(
    (v) => v.voterId === entry.voterId && v.position === entry.position,
  )
  if (existing) {
    return { success: false, reason: 'already_voted', hash: existing.hash }
  }
  entry.hash = hash(entry)
  ledger.votes.push(entry)
  return { success: true, hash: entry.hash }
}

export function getAllVotes(){
  return ledger.votes.slice()
}

export function getStats(){
  const counts = {}
  for(const v of ledger.votes){
    const c = v.choice || 'unknown'
    counts[c] = (counts[c] || 0) + 1
  }
  return counts
}

export default { addVote, getAllVotes, getStats }
