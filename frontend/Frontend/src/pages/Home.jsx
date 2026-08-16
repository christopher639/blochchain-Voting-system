import { useNavigate } from 'react-router-dom'

export default function Home() {
  const navigate = useNavigate()
  function handleCast(){
    localStorage.setItem('postLogin', 'vote')
    navigate('/login')
  }

  return (
    <div className="container py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-3xl font-bold">University of Ghana — SRC Voting</h1>
          <p className="mt-4 text-lg muted">Secure, transparent, and verifiable electronic voting for student governance. Cast your vote confidently — results are recorded on an auditable blockchain ledger.</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={handleCast} className="btn btn-primary">Cast Your Vote</button>
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
    </div>
  )
}
