import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import Button from '../common/Button';

// Component to handle bounds and zooming out to fit both points
const MapAutoBounds = ({ start, end }) => {
    const map = useMap();

    useEffect(() => {
        if (start && end) {
            const bounds = L.latLngBounds([start, end]);
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [start, end, map]);

    return null;
};

const RouteMap = ({ start, end, height = '400px' }) => {
    const polylineOptions = { color: '#3b82f6', weight: 4, opacity: 0.7 };

    const handleOpenNavigation = () => {
        if (end) {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${end[0]},${end[1]}`;
            window.open(url, '_blank');
        }
    };

    if (!start) return null;

    return (
        <div className="relative">
            <div style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden' }}>
                <MapContainer center={start} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={start} />
                    {end && <Marker position={end} />}
                    {start && end && (
                        <>
                            <Polyline positions={[start, end]} pathOptions={polylineOptions} />
                            <MapAutoBounds start={start} end={end} />
                        </>
                    )}
                </MapContainer>
            </div>

            <Button
                className="absolute bottom-4 right-4 shadow-xl z-[400]"
                icon={Navigation}
                onClick={handleOpenNavigation}
            >
                Navigation
            </Button>
        </div>
    );
};

export default RouteMap;
