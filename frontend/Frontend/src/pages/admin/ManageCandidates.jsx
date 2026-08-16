import { useState, useEffect } from 'react'
import api from '../../lib/api'

export default function ManageCandidates(){
  const [showForm, setShowForm] = useState(false)
  const [candidates, setCandidates] = useState([])
  const [form, setForm] = useState({ name: '', position: '', studentId: '', biography: '', runningMateName: '', runningMateStudentId: '', runningMateBiography: '' })
  const [imageFile, setImageFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [runningMateFile, setRunningMateFile] = useState(null)
  const [runningMatePreview, setRunningMatePreview] = useState(null)
  const [positions, setPositions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{ load() }, [])
  async function load(){
    const items = await api.fetchCandidates()
    setCandidates(items || [])
    const pos = await api.fetchPositions()
    setPositions(pos || [])
  }

  async function handleSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const fd = new FormData()
      fd.append('name', form.name)
      fd.append('studentId', form.studentId)
      fd.append('biography', form.biography)
      fd.append('position', form.position)
      const runningMate = { name: form.runningMateName, studentId: form.runningMateStudentId, biography: form.runningMateBiography }
      fd.append('runningMate', JSON.stringify(runningMate))
      if (imageFile) fd.append('candidateImage', imageFile)
      if (runningMateFile) fd.append('runningMateImage', runningMateFile)
      const res = await api.createCandidate(fd)
      if (res && res._id) {
        setShowForm(false)
        setForm({ name: '', position: '', metadata: '' })
        setImageFile(null)
        load()
      } else {
        alert(res.error || 'Failed to create')
      }
    } finally { setLoading(false) }
  }

  function onFileChange(e){
    const f = e.target.files[0]
    if (!f) return setImageFile(null)
    if (!f.type.startsWith('image/')) return alert('Please select an image file')
    if (f.size > 2 * 1024 * 1024) return alert('Image must be <2MB')
    setImageFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function onRunningMateFileChange(e){
    const f = e.target.files[0]
    if (!f) return setRunningMateFile(null)
    if (!f.type.startsWith('image/')) return alert('Please select an image file')
    if (f.size > 2 * 1024 * 1024) return alert('Image must be <2MB')
    setRunningMateFile(f)
    setRunningMatePreview(URL.createObjectURL(f))
  }

  function removeImage(){ setImageFile(null); setPreviewUrl(null) }
  function removeRunningMateImage(){ setRunningMateFile(null); setRunningMatePreview(null) }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Candidates</h1>
        <button onClick={()=>setShowForm(true)} className="bg-blue-600 text-white px-3 py-2 rounded">Add New Candidate</button>
      </div>

      <div className="mt-4 bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-gray-500"><tr><th>Photo</th><th>Name</th><th>Position</th><th>Actions</th></tr></thead>
          <tbody>
            {candidates.map(c=> (
              <tr key={c._id} className="border-t">
                <td className="py-2"><img src={c.imageUrl || '/uploads/placeholder.png'} alt="" className="h-8 w-8 rounded object-cover"/></td>
                <td className="py-2">{c.name}</td>
                <td className="py-2">{c.position?.name || c.position}</td>
                <td className="py-2">View / Edit</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white p-4 sm:p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
            <h2 className="font-medium text-lg">Add Candidate</h2>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="w-full border p-2 rounded" placeholder="Full name" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} required />
                <input className="w-full border p-2 rounded" placeholder="Student ID" value={form.studentId} onChange={e=>setForm({...form, studentId: e.target.value})} />
              </div>
              <select className="w-full border p-2 rounded" value={form.position} onChange={e=>setForm({...form, position: e.target.value})} required>
                <option value="">Select position</option>
                {positions.map(p=> <option value={p._id} key={p._id}>{p.name}</option>)}
              </select>
              <textarea className="w-full border p-2 rounded" placeholder="Short biography" value={form.biography} onChange={e=>setForm({...form, biography: e.target.value})} />
              <div>
                <label className="text-sm block mb-1">Candidate Photo</label>
                <input type="file" accept="image/*" onChange={onFileChange} className="block w-full text-sm text-gray-600" />
                {previewUrl ? (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={previewUrl} className="h-20 w-20 rounded object-cover" />
                    <div>
                      <button type="button" onClick={removeImage} className="px-2 py-1 text-sm">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm muted">No image selected — placeholder will be used</div>
                )}
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-medium">Running Mate</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <input className="w-full border p-2 rounded" placeholder="Running mate full name" value={form.runningMateName} onChange={e=>setForm({...form, runningMateName: e.target.value})} />
                  <input className="w-full border p-2 rounded" placeholder="Running mate Student ID" value={form.runningMateStudentId} onChange={e=>setForm({...form, runningMateStudentId: e.target.value})} />
                </div>
                <textarea className="w-full border p-2 rounded mt-2" placeholder="Running mate biography" value={form.runningMateBiography} onChange={e=>setForm({...form, runningMateBiography: e.target.value})} />
                <label className="text-sm mt-2 block">Running Mate Photo</label>
                <input type="file" accept="image/*" onChange={onRunningMateFileChange} className="block w-full text-sm text-gray-600" />
                {runningMatePreview ? (
                  <div className="mt-2 flex items-center gap-2">
                    <img src={runningMatePreview} className="h-20 w-20 rounded object-cover" />
                    <div>
                      <button type="button" onClick={removeRunningMateImage} className="px-2 py-1 text-sm">Remove</button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 text-sm muted">No running mate image selected</div>
                )}
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={()=>setShowForm(false)} className="px-3 py-2 rounded border">Cancel</button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
