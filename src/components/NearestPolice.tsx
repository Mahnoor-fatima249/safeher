'use client';
import { useState } from 'react';

export default function NearestPolice() {
  const [stations, setStations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const findPoliceStations = () => {
    setLoading(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // Overpass API query jo 5km ke radius mein police stations dhondegi
        const query = `
          [out:json];
          node["amenity"="police"](around:5000,${lat},${lon});
          out body;
        `;

        try {
          const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query,
          });
          const data = await response.json();
          setStations(data.elements);
        } catch (err) {
          setError('Failed to fetch police stations.');
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 mt-6">
      <h2 className="text-xl font-bold text-rose-600 mb-2">📍 Nearest Police Stations</h2>
      <p className="text-slate-500 text-sm mb-4">Find police stations around your current location.</p>

      <button
        onClick={findPoliceStations}
        disabled={loading}
        className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-semibold transition mb-4"
      >
        {loading ? 'Searching nearby...' : 'Find Police Stations'}
      </button>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-3 max-h-60 overflow-y-auto">
        {stations.map((station, index) => (
          <div key={index} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white">
              {station.tags.name || 'Police Station (Unnamed)'}
            </h3>
            <p className="text-xs text-slate-500">
              Lat: {station.lat}, Lon: {station.lon}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}