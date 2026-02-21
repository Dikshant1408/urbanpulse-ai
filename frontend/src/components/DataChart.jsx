import React, { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const TRAFFIC_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  value: [120,95,80,70,90,150,420,780,950,870,720,680,750,820,790,860,920,1050,1100,980,750,580,380,220][h],
}))

const AQI_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: [45,52,48,61,75,110,130,145,160,155,148,135,120,108,95,88,80,72,65,58,52,48,55,62,70,85,100,115,130,125][i],
}))

const ENERGY_DATA = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  value: [210,190,175,165,170,195,280,380,450,480,510,530,520,500,490,505,530,580,640,700,720,680,580,380][h],
}))

const DATASETS = {
  traffic: { data: TRAFFIC_DATA, xKey: 'hour', label: 'Traffic Volume', color: '#3b82f6', unit: 'vehicles' },
  aqi: { data: AQI_DATA, xKey: 'day', label: 'AQI', color: '#f59e0b', unit: 'AQI' },
  energy: { data: ENERGY_DATA, xKey: 'hour', label: 'Energy Usage', color: '#10b981', unit: 'kWh' },
}

export default function DataChart() {
  const [active, setActive] = useState('traffic')
  const ds = DATASETS[active]

  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-100">Data Visualization</h2>
        <div className="flex gap-2">
          {Object.keys(DATASETS).map((key) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                active === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={ds.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey={ds.xKey}
            tick={{ fill: '#9ca3af', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#e5e7eb' }}
            itemStyle={{ color: ds.color }}
            formatter={(v) => [`${v} ${ds.unit}`, ds.label]}
          />
          <Legend wrapperStyle={{ color: '#9ca3af' }} />
          <Line
            type="monotone"
            dataKey="value"
            name={ds.label}
            stroke={ds.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
