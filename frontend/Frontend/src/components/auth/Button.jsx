import React from 'react'

export default function Button({ children, type = 'button', primary=false, disabled=false, onClick }){
  const base = 'inline-flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium border'
  const primaryClass = primary ? 'bg-blue-600 text-white border-transparent' : 'bg-white text-gray-700 border-gray-200'
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : ''
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${primaryClass} ${disabledClass}`}>
      {children}
    </button>
  )
}
