import { Link, useLocation } from 'react-router-dom'

const voterItems = [
  { to: '/', label: 'Home' },
  { to: '/positions', label: 'Candidates' },
  { to: '/vote/ballot', label: 'Vote' },
  { to: '/vote/receipt', label: 'My Status' },
]

export default function VoterNav(){
  const loc = useLocation()
  return (
    <nav className="w-full bg-white border-b md:hidden">
      <div className="flex items-center justify-around p-2">
        {voterItems.map(i=> (
          <Link key={i.to} to={i.to} className={`text-sm ${loc.pathname === i.to ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
            {i.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
