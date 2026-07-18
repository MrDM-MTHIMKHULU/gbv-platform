import { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../lib/supabaseClient';

// Custom colored pin markers built as divIcons, avoiding the well-known
// Leaflet + webpack default-marker-asset bug entirely.
function pinIcon(color) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 22px; height: 22px; border-radius: 50% 50% 50% 0;
      background: ${color}; transform: rotate(-45deg);
      border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.35);
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 22],
    popupAnchor: [0, -22],
  });
}

const shelterIcon = pinIcon('#C41E3A');
const hotspotIcon = pinIcon('#B45309');
const meIcon = L.divIcon({
  className: '',
  html: `<div style="
    width: 16px; height: 16px; border-radius: 50%;
    background: #2563eb; border: 3px solid white;
    box-shadow: 0 0 0 4px rgba(37,99,235,0.25);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function RecenterOnLocate({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.setView([position.lat, position.lng], 11);
  }, [position]);
  return null;
}

// Leaflet sometimes calculates its size before the container has finished
// laying out (especially inside a dynamically-loaded component). This
// forces a recalculation right after mount so tiles don't render
// misaligned or cut off.
function InvalidateSizeOnMount() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => map.invalidateSize(), 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

export default function SheltersMap() {
  const [shelters, setShelters] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [showHotspots, setShowHotspots] = useState(true);
  const [province, setProvince] = useState('All');
  const [userPos, setUserPos] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState('');

  useEffect(() => {
    supabase
      .from('shelters')
      .select('*')
      .then(({ data }) => setShelters(data || []));
    supabase
      .from('hotspots')
      .select('*')
      .then(({ data }) => setHotspots(data || []));
  }, []);

  const provinces = useMemo(() => {
    const set = new Set(shelters.map((s) => s.province));
    return ['All', ...Array.from(set).sort()];
  }, [shelters]);

  const filteredShelters = useMemo(() => {
    let list = province === 'All' ? shelters : shelters.filter((s) => s.province === province);
    if (userPos) {
      list = [...list].sort(
        (a, b) =>
          haversineKm(userPos.lat, userPos.lng, a.latitude, a.longitude) -
          haversineKm(userPos.lat, userPos.lng, b.latitude, b.longitude)
      );
    }
    return list;
  }, [shelters, province, userPos]);

  const findNearMe = () => {
    if (!navigator.geolocation) {
      setLocateError('Location services are not available on this device.');
      return;
    }
    setLocating(true);
    setLocateError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocateError('Could not get your location. You can still browse by province.');
        setLocating(false);
      }
    );
  };

  return (
    <div className="shelters-map">
      <div className="map-controls">
        <select
          className="province-select"
          value={province}
          onChange={(e) => setProvince(e.target.value)}
        >
          {provinces.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <button className="locate-btn" onClick={findNearMe} disabled={locating}>
          {locating ? 'Locating…' : 'Find shelters near me'}
        </button>

        <label className="hotspot-toggle">
          <input
            type="checkbox"
            checked={showHotspots}
            onChange={(e) => setShowHotspots(e.target.checked)}
          />
          Show hotspot areas
        </label>
      </div>

      {locateError && <p className="locate-error">{locateError}</p>}

      <div className="map-wrap">
        <MapContainer
          center={[-28.8, 24.7]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '520px', width: '100%', borderRadius: '12px' }}
        >
          <InvalidateSizeOnMount />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {userPos && (
            <>
              <Marker position={[userPos.lat, userPos.lng]} icon={meIcon}>
                <Popup>You are here</Popup>
              </Marker>
              <RecenterOnLocate position={userPos} />
            </>
          )}

          {filteredShelters.map((s) => (
            <Marker key={s.id} position={[s.latitude, s.longitude]} icon={shelterIcon}>
              <Popup>
                <strong>{s.name}</strong>
                <br />
                {s.address}
                <br />
                {s.services?.length > 0 && (
                  <span className="popup-services">{s.services.join(', ')}</span>
                )}
                {s.phone && (
                  <>
                    <br />
                    <a href={`tel:${s.phone.replace(/\D/g, '')}`}>{s.phone}</a>
                  </>
                )}
              </Popup>
            </Marker>
          ))}

          {showHotspots &&
            hotspots.map((h) => (
              <Marker key={h.id} position={[h.latitude, h.longitude]} icon={hotspotIcon}>
                <Popup>
                  <strong>{h.station}</strong> ({h.province})
                  <br />
                  {h.tooltip}
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>

      <div className="legend">
        <span className="legend-item">
          <span className="legend-dot shelter" /> Verified shelter/service
        </span>
        <span className="legend-item">
          <span className="legend-dot hotspot" /> Known hotspot area
        </span>
      </div>

      {shelters.length === 0 && (
        <p className="empty-note">
          No shelters loaded yet, this map layer will populate once shelter
          data is added.
        </p>
      )}

      <style jsx>{`
        .shelters-map {
          width: 100%;
        }
        .map-controls {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 14px;
        }
        .province-select {
          background: white;
          border: 1px solid var(--sand);
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 0.88rem;
          color: var(--ink);
        }
        .locate-btn {
          background: var(--rose);
          color: white;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .locate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .hotspot-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--muted);
          font-weight: 600;
        }
        .locate-error {
          font-size: 0.82rem;
          color: var(--rose-deep);
          margin-bottom: 10px;
        }
        .map-wrap {
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--sand);
        }
        .legend {
          display: flex;
          gap: 20px;
          margin-top: 14px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: var(--muted);
        }
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: inline-block;
        }
        .legend-dot.shelter {
          background: #c41e3a;
        }
        .legend-dot.hotspot {
          background: #b45309;
        }
        .empty-note {
          font-size: 0.85rem;
          color: var(--muted);
          margin-top: 14px;
          background: var(--warm);
          border-radius: 8px;
          padding: 12px 16px;
        }
        .popup-services {
          font-size: 0.82rem;
          color: var(--muted);
        }
      `}</style>
    </div>
  );
}
