import React, { useState } from 'react'

export default function PasswordInput({ id, label, value, onChange, required=false, hint }){
  const [visible, setVisible] = useState(false)
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-600"> *</span>}</label>
      <div className="mt-1 relative">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={e=>onChange(e.target.value)}
          className="block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-required={required}
        />
        <button type="button" onClick={()=>setVisible(v=>!v)} aria-label={visible ? 'Hide password' : 'Show password'} className="absolute right-2 top-2 text-sm text-gray-500">
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  )
}
