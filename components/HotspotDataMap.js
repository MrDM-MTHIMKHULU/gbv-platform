import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabaseClient';

function hotspotWarningIcon() {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 0; height: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-bottom: 19px solid #b45309;
      position: relative;
      filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35));
    "><span style="
      position: absolute; top: 7px; left: -11px; width: 22px;
      text-align: center; color: white; font-weight: 800; font-size: 10px;
    ">!</span></div>`,
    iconSize: [22, 19],
    iconAnchor: [11, 19],
    popupAnchor: [0, -19],
  });
}

const hotspotIcon = hotspotWarningIcon();

// Leaflet sometimes sizes itself before its container finishes layout,
// especially inside a dynamically-loaded component, this forces a
// recalculation right after mount.
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function HotspotDataMap() {
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    supabase
      .from('hotspots')
      .select('*')
      .then(({ data }) => setHotspots(data || []));
  }, []);

  return (
    <div className="hotspot-map">
      <div className="map-wrap">
        <MapContainer
          center={[-28.8, 24.7]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '440px', width: '100%', borderRadius: '12px' }}
        >
          <InvalidateSizeOnMount />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {hotspots.map((h) => (
            <Circle
              key={`${h.id}-area`}
              center={[h.latitude, h.longitude]}
              radius={3000}
              pathOptions={{
                color: '#b45309',
                weight: 1,
                opacity: 0.4,
                fillColor: '#b45309',
                fillOpacity: 0.1,
              }}
            />
          ))}

          {hotspots.map((h) => (
            <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hotspotIcon}>
              <Popup>
                <strong>{h.station}</strong> ({h.province})
                <br />
                {h.tooltip}
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        <div className="map-legend">
          <span className="legend-icon">!</span>
          <span>Known hotspot, approx. zone</span>
        </div>
      </div>

      {hotspots.length === 0 && (
        <p className="empty-note">Hotspot data will appear here once added.</p>
      )}

      <style jsx>{`
        .hotspot-map {
          width: 100%;
        }
        .map-wrap {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--sand);
        }
        .map-legend {
          position: absolute;
          bottom: 14px;
          left: 14px;
          z-index: 1000;
          background: white;
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 8px 12px;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.78rem;
          color: var(--ink);
        }
        .legend-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #b45309;
          color: white;
          font-weight: 800;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .empty-note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 14px;
          background: var(--warm);
          border-radius: 8px;
          padding: 12px 16px;
        }
      `}</style>
    </div>
  );
}
