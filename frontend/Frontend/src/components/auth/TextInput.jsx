import React from 'react'

export default function TextInput({ id, label, value, onChange, type='text', placeholder='', required=false, autoComplete }){
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}{required && <span className="text-red-600"> *</span>}</label>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="mt-1 block w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
        aria-required={required}
      />
    </div>
  )
}
