import React from 'react'

export default function Sparkline({ data = [], width = 200, height = 40, stroke = '#2563eb' }){
  if (!data || data.length === 0) return <svg width={width} height={height}><text x="10" y="20" className="text-xs text-gray-400">no data</text></svg>
  const max = Math.max(...data)
  const min = Math.min(...data)
  const len = data.length
  const step = width / Math.max(1, len - 1)
  const points = data.map((d, i) => {
    const x = i * step
    const y = max === min ? height / 2 : height - ((d - min) / (max - min)) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  const areaPath = (() => {
    const coords = data.map((d, i) => {
      const x = i * step
      const y = max === min ? height / 2 : height - ((d - min) / (max - min)) * (height - 4) - 2
      return `${x},${y}`
    })
    return `M0,${height} L${coords.join(' ')} L${width},${height} Z`
  })()

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
      <path d={areaPath} fill="rgba(37,99,235,0.08)" />
      <polyline fill="none" stroke={stroke} strokeWidth="2" points={points} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
