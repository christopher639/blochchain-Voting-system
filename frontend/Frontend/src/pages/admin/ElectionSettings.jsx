import { useState } from 'react'

export default function ElectionSettings(){
  const [state, setState] = useState({ method: 'single', chain: 'testnet', publicResults: false })

  return (
    <div>
      <h1 className="text-2xl font-semibold">Election Settings</h1>
      <div className="mt-4 bg-white p-4 rounded shadow space-y-4">
        <div>
          <label className="block text-sm">Start / End</label>
          <div className="flex gap-2 mt-2">
            <input type="datetime-local" className="border p-2 rounded" />
            <input type="datetime-local" className="border p-2 rounded" />
          </div>
        </div>

        <div>
          <label className="block text-sm">Voting method</label>
          <select value={state.method} onChange={e=>setState(s=>({ ...s, method: e.target.value }))} className="border p-2 rounded mt-2">
            <option value="single">Single choice</option>
            <option value="ranked">Ranked choice</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Blockchain</label>
          <input className="w-full border p-2 rounded mt-2" placeholder="Contract address / network" />
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" checked={state.publicResults} onChange={e=>setState(s=>({ ...s, publicResults: e.target.checked }))} />
          <label className="text-sm">Show public results live</label>
        </div>

        <div className="flex justify-end">
          <button className="px-3 py-2 bg-blue-600 text-white rounded">Save settings</button>
        </div>
      </div>
    </div>
  )
}
