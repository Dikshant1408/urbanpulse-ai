import React, { useState, useEffect } from 'react'
import KpiCard from './components/KpiCard'
import DataChart from './components/DataChart'
import CityMap from './components/CityMap'
import RecommendationPanel from './components/RecommendationPanel'
import PredictForm from './components/PredictForm'

const BASE = ''  // uses Vite proxy

export default function App() {
  const [kpi, setKpi] = useState({ traffic: null, aqi: null, energy: null })
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  async function fetchData() {
    setLoading(true)
    setError(null)
    try {
      const [trafficRes, aqiRes, energyRes, recRes] = await Promise.all([
        fetch(`${BASE}/predict/traffic?hour=8`),
        fetch(`${BASE}/predict/aqi?day=15`),
        fetch(`${BASE}/predict/energy?hour=18`),
        fetch(`${BASE}/recommend`),
      ])

      if (!trafficRes.ok || !aqiRes.ok || !energyRes.ok || !recRes.ok) {
        throw new Error('One or more API calls failed.')
      }

      const [trafficData, aqiData, energyData, recData] = await Promise.all([
        trafficRes.json(),
        aqiRes.json(),
        energyRes.json(),
        recRes.json(),
      ])

      setKpi({
        traffic: trafficData.predicted_traffic_volume,
        aqi: aqiData.predicted_AQI,
        energy: energyData.predicted_energy_usage,
      })
      setRecommendations(recData.recommendations)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const aqiStatus = (v) => {
    if (v === null) return ''
    if (v > 150) return '🔴 Unhealthy'
    if (v > 100) return '🟠 Moderate'
    return '🟢 Good'
  }

  const trafficStatus = (v) => {
    if (v === null) return ''
    if (v > 900) return '🔴 Heavy congestion'
    if (v > 600) return '🟠 Moderate traffic'
    return '🟢 Light traffic'
  }

  const energyStatus = (v) => {
    if (v === null) return ''
    if (v > 600) return '🔴 High usage'
    if (v > 450) return '🟠 Elevated'
    return '🟢 Normal'
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏙️</span>
            <div>
              <h1 className="text-xl font-bold text-white">UrbanPulse AI</h1>
              <p className="text-xs text-gray-400">Smart City Risk &amp; Resource Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-500">Updated: {lastUpdated}</span>
            )}
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            >
              {loading ? '⏳ Loading…' : '🔄 Refresh'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 rounded-xl bg-red-900/30 border border-red-700 px-4 py-3 text-red-300 text-sm">
            ⚠️ Backend connection error: {error}. Make sure the FastAPI server is running on port 8000.
          </div>
        )}

        {/* KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KpiCard
            title="Traffic Volume"
            value={loading ? '…' : kpi.traffic}
            unit="vehicles"
            icon="🚗"
            color="blue"
            status={trafficStatus(kpi.traffic)}
          />
          <KpiCard
            title="Air Quality Index"
            value={loading ? '…' : kpi.aqi}
            unit="AQI"
            icon="🌿"
            color={kpi.aqi > 150 ? 'red' : kpi.aqi > 100 ? 'yellow' : 'green'}
            status={aqiStatus(kpi.aqi)}
          />
          <KpiCard
            title="Energy Usage"
            value={loading ? '…' : kpi.energy}
            unit="kWh"
            icon="⚡"
            color={kpi.energy > 600 ? 'red' : kpi.energy > 450 ? 'yellow' : 'green'}
            status={energyStatus(kpi.energy)}
          />
        </section>

        {/* Charts and Map row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DataChart />
          <CityMap />
        </section>

        {/* Recommendations and Predict Form row */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecommendationPanel
            recommendations={recommendations}
            loading={loading}
            error={error}
          />
          <PredictForm />
        </section>
      </main>

      <footer className="border-t border-gray-800 mt-12 py-6 text-center text-xs text-gray-600">
        UrbanPulse AI © 2024 – Smart City Risk &amp; Resource Intelligence Dashboard
      </footer>
    </div>
  )
}
