import VoterTopbar from '../components/voter/VoterTopbar'
import VoterNav from '../components/voter/VoterNav'

export default function VoterLayout({ children }){
  const voterName = localStorage.getItem('username') || 'Voter'
  return (
    <div className="min-h-screen bg-gray-50">
      <VoterTopbar voterName={voterName} />
      <VoterNav />
      <main className="p-6 max-w-5xl mx-auto">{children}</main>
    </div>
  )
}
