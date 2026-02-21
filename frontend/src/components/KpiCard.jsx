import React from 'react'

export default function KpiCard({ title, value, unit, icon, color, status }) {
  const colorMap = {
    blue: 'border-blue-500 bg-blue-900/20',
    green: 'border-green-500 bg-green-900/20',
    yellow: 'border-yellow-500 bg-yellow-900/20',
    red: 'border-red-500 bg-red-900/20',
  }

  const textColorMap = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-yellow-400',
    red: 'text-red-400',
  }

  return (
    <div
      className={`rounded-2xl border-l-4 p-5 shadow-lg ${colorMap[color] || colorMap.blue}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400 uppercase tracking-widest">{title}</span>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${textColorMap[color]}`}>
        {value !== null && value !== undefined ? value : '—'}
        <span className="text-base font-normal text-gray-400 ml-1">{unit}</span>
      </div>
      {status && (
        <div className="mt-2 text-xs text-gray-400">{status}</div>
      )}
    </div>
  )
}
