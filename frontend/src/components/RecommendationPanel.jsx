import React from 'react'

const ICONS = {
  traffic: '🚦',
  aqi: '🌫️',
  energy: '⚡',
}

const SEVERITY = (text) => {
  if (/high|poor|spike/i.test(text)) return 'border-red-500 bg-red-900/20 text-red-300'
  if (/moderate|elevated|unhealthy/i.test(text)) return 'border-yellow-500 bg-yellow-900/20 text-yellow-300'
  return 'border-green-500 bg-green-900/20 text-green-300'
}

export default function RecommendationPanel({ recommendations, loading, error }) {
  if (loading) {
    return (
      <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">🤖 AI Recommendations</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">🤖 AI Recommendations</h2>
        <p className="text-red-400 text-sm">⚠️ Failed to load recommendations: {error}</p>
      </div>
    )
  }

  const categories = ['traffic', 'aqi', 'energy']

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">🤖 AI Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((rec, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 border-l-4 rounded-xl px-4 py-3 text-sm ${SEVERITY(rec)}`}
          >
            <span className="text-xl mt-0.5">{ICONS[categories[idx]] || '📌'}</span>
            <span>{rec}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
