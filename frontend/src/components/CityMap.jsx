import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.heat'

// Mock city hotspot coordinates (lat, lng, intensity)
const HOTSPOTS = [
  [28.6139, 77.2090, 0.9],   // Delhi center
  [28.6250, 77.2150, 0.75],
  [28.6050, 77.2250, 0.85],
  [28.6300, 77.1980, 0.6],
  [28.5980, 77.2310, 0.7],
  [28.6400, 77.2000, 0.55],
  [28.6100, 77.1900, 0.65],
  [28.6200, 77.2400, 0.8],
  [28.5900, 77.2100, 0.5],
  [28.6350, 77.2300, 0.72],
]

function HeatLayer({ points }) {
  const map = useMap()

  useEffect(() => {
    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 14,
      gradient: { 0.3: '#3b82f6', 0.6: '#f59e0b', 0.9: '#ef4444' },
    }).addTo(map)

    return () => {
      map.removeLayer(heatLayer)
    }
  }, [map, points])

  return null
}

export default function CityMap() {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
      <h2 className="text-lg font-semibold text-gray-100 mb-4">
        🗺️ City Risk Heatmap
      </h2>
      <div className="rounded-xl overflow-hidden" style={{ height: '320px' }}>
        <MapContainer
          center={[28.6139, 77.209]}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <HeatLayer points={HOTSPOTS} />
        </MapContainer>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Heatmap intensity reflects combined traffic, AQI, and energy risk scores.
      </p>
    </div>
  )
}
