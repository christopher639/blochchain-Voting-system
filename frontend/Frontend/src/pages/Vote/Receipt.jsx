import { useEffect, useState } from 'react'

export default function Receipt(){
  const [hash, setHash] = useState(null)

  useEffect(()=>{
    setHash(localStorage.getItem('lastVoteHash'))
  },[])

  return (
    <div className="container py-8">
      <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold">Vote Receipt</h2>
        {hash ? (
          <div className="mt-4">
            <p className="text-sm text-gray-700">Your vote was recorded.</p>
            <div className="mt-3 p-3 bg-slate-50 rounded">
              <p className="text-xs text-gray-500">Receipt (vote hash)</p>
              <div className="font-mono break-all">{hash}</div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Save this value to verify your vote on the public ledger.</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No receipt found.</p>
        )}
      </div>
    </div>
  )
}
