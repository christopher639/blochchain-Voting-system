import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Verify(){
  const [studentId, setStudentId] = useState('')
  const [otp, setOtp] = useState('')
  const [sent, setSent] = useState(false)
  const [constituency, setConstituency] = useState('all')
  const navigate = useNavigate()

  function sendOtp(){
    // Simulate sending OTP
    setSent(true)
    // store student id for flow
    localStorage.setItem('voterId', studentId)
    localStorage.setItem('constituency', constituency)
  }

  function proceed(){
    // Basic check
    if(!localStorage.getItem('voterId')) return
    navigate('/vote/ballot')
  }

  return (
    <div className="container py-8">
      <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
        <h2 className="text-xl font-semibold">Verify Identity (mock)</h2>

        <label className="block mt-4 text-sm">
          Constituency
          <select className="mt-1 block w-full rounded border-gray-200" value={constituency} onChange={e=>setConstituency(e.target.value)}>
            <option value="all">All / General</option>
            <option value="legon-hall">Legon Hall</option>
            <option value="north-hall">North Hall</option>
          </select>
        </label>

        <label className="block mt-4 text-sm">
          Student ID
          <input className="mt-1 block w-full rounded border-gray-200 p-2" value={studentId} onChange={e=>setStudentId(e.target.value)} />
        </label>

        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={sendOtp}>Send OTP</button>
        </div>

        {sent && (
          <div className="mt-4">
            <label className="block text-sm">Enter OTP (mock)
              <input className="mt-1 block w-full rounded border-gray-200 p-2" value={otp} onChange={e=>setOtp(e.target.value)} />
            </label>
            <div className="mt-4">
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={proceed}>Verify & Continue</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
