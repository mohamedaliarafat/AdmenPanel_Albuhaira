import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io from 'socket.io-client';
import api from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// أيقونة افتراضية للسائق
const driverIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const socket = io('http://localhost:6014'); // عنوان السيرفر

const LiveTrackingPage = () => {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    // جلب السائقين من قاعدة البيانات
    const fetchDrivers = async () => {
      const token = localStorage.getItem('token');
      const res = await api.get('/delivery', { headers: { Authorization: `Bearer ${token}` } });
      setDrivers(res.data);
    };
    fetchDrivers();

    // الاستماع لتحديثات الموقع
    socket.on('locationUpdated', ({ driverId, lat, lng }) => {
      setDrivers(prev => prev.map(d => d._id === driverId ? { ...d, location: { lat, lng } } : d));
    });

    return () => socket.off('locationUpdated');
  }, []);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <MapContainer center={[24.7136, 46.6753]} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {drivers.map(driver => (
          <Marker
            key={driver._id}
            position={[driver.location.lat, driver.location.lng]}
            icon={driverIcon}
          >
            <Popup>
              {driver.name} - {driver.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LiveTrackingPage;
