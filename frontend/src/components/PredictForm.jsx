import React, { useState } from 'react'

const BASE = ''  // uses Vite proxy

export default function PredictForm() {
  const [form, setForm] = useState({ type: 'traffic', input: '8' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const TYPES = {
    traffic: { label: 'Traffic', param: 'hour', range: '0–23', endpoint: '/predict/traffic', key: 'predicted_traffic_volume', unit: 'vehicles' },
    aqi: { label: 'AQI', param: 'day', range: '1–30', endpoint: '/predict/aqi', key: 'predicted_AQI', unit: 'AQI' },
    energy: { label: 'Energy', param: 'hour', range: '0–23', endpoint: '/predict/energy', key: 'predicted_energy_usage', unit: 'kWh' },
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    const cfg = TYPES[form.type]
    try {
      const res = await fetch(`${BASE}${cfg.endpoint}?${cfg.param}=${form.input}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setResult({ value: data[cfg.key], unit: cfg.unit, label: cfg.label })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">🔍 Live Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Prediction Type</label>
          <select
            className="w-full bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value, input: '' })}
          >
            {Object.entries(TYPES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {TYPES[form.type].param.charAt(0).toUpperCase() + TYPES[form.type].param.slice(1)}{' '}
            <span className="text-gray-500">({TYPES[form.type].range})</span>
          </label>
          <input
            type="number"
            className="w-full bg-gray-800 text-gray-100 rounded-lg px-3 py-2 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            value={form.input}
            onChange={(e) => setForm({ ...form, input: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Predicting…' : 'Predict'}
        </button>
      </form>
      {result && (
        <div className="mt-4 rounded-xl bg-blue-900/30 border border-blue-700 px-4 py-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Predicted {result.label}</p>
          <p className="text-2xl font-bold text-blue-300">
            {result.value} <span className="text-sm font-normal text-gray-400">{result.unit}</span>
          </p>
        </div>
      )}
      {error && (
        <p className="mt-3 text-red-400 text-sm">⚠️ {error}</p>
      )}
    </div>
  )
}
