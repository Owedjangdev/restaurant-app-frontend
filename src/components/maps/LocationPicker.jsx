import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { LocateFixed, MapPin } from 'lucide-react';
import { COTONOU_CENTER, MAP_DEFAULTS } from '../../utils/constants';
import Button from '../common/Button';
import Input from '../common/Input';

const LocationMarker = ({ position, setPosition }) => {
    useMapEvents({
        click(e) {
            setPosition([e.latlng.lat, e.latlng.lng]);
        },
    });

    return position === null ? null : (
        <Marker position={position} />
    );
};

const LocationPicker = ({ initialPosition, onLocationSelect }) => {
    const [position, setPosition] = useState(initialPosition || COTONOU_CENTER);
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (position) {
            // Logic for reverse geocoding could go here (e.g. using Nominatim)
            // For now, we'll just acknowledge the position change
            onLocationSelect(position[0], position[1], address);
        }
    }, [position, address, onLocationSelect]);

    const handleUseCurrentLocation = () => {
        setLoading(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setPosition([pos.coords.latitude, pos.coords.longitude]);
                    setLoading(false);
                },
                () => {
                    alert("Impossible de récupérer votre position");
                    setLoading(false);
                }
            );
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <Input
                    label="Adresse de livraison"
                    placeholder="Entrez votre adresse ou déplacez le marqueur"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    containerClassName="flex-1"
                    icon={MapPin}
                />
                <Button
                    variant="outline"
                    className="mt-6"
                    onClick={handleUseCurrentLocation}
                    loading={loading}
                    icon={LocateFixed}
                >
                    Ma position
                </Button>
            </div>

            <div style={{ height: '300px', width: '100%', borderRadius: '0.75rem', overflow: 'hidden' }}>
                <MapContainer center={position} zoom={MAP_DEFAULTS.ZOOM} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
            </div>

            <p className="text-xs text-gray-500 italic">
                * Cliquez sur la carte pour affiner l'emplacement exact
            </p>
        </div>
    );
};

export default LocationPicker;
