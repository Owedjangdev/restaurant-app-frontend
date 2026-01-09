import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { COTONOU_CENTER, MAP_DEFAULTS } from '../../utils/constants';

// Fix for default marker icons in Leaflet with React
// This avoids the issue where markers are not displayed correctly
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapView = ({
    center = COTONOU_CENTER,
    zoom = MAP_DEFAULTS.ZOOM,
    markers = [],
    height = '400px'
}) => {
    return (
        <div style={{ height, width: '100%', borderRadius: '1rem', overflow: 'hidden' }} className="border border-gray-100 shadow-inner">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker) => (
                    <Marker key={marker.id} position={marker.position}>
                        {marker.popup && <Popup>{marker.popup}</Popup>}
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
