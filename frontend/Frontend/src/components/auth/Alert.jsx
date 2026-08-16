import React from 'react'

export default function Alert({ type='info', children }){
  const color = type === 'error' ? 'text-red-700 bg-red-50' : 'text-gray-700 bg-gray-50'
  return (
    <div role="alert" className={`p-3 rounded-md ${color} border border-gray-100 text-sm`}>{children}</div>
  )
}
