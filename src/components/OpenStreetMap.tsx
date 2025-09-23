import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Users, Shield, AlertTriangle, RotateCcw } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapLocation {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  status: 'safe' | 'warning' | 'alert';
  type: 'tourist' | 'incident' | 'geofence';
  lastSeen?: string;
}

interface OpenStreetMapProps {
  className?: string;
  height?: string;
  locations?: MapLocation[];
}

interface Location {
  lat: number;
  lng: number;
}

// Custom marker icons
const createCustomIcon = (type: string, status: string) => {
  const getColor = () => {
    switch (status) {
      case 'safe': return '#22c55e';
      case 'warning': return '#eab308';
      case 'alert': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSymbol = () => {
    switch (type) {
      case 'tourist': return '👤';
      case 'incident': return '⚠️';
      case 'geofence': return '🛡️';
      default: return '📍';
    }
  };

  return new L.DivIcon({
    html: `<div style="background-color: ${getColor()}; border: 2px solid white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${getSymbol()}</div>`,
    className: 'custom-div-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
};

const createUserLocationIcon = () => {
  return new L.DivIcon({
    html: `<div style="background-color: #3b82f6; border: 3px solid white; border-radius: 50%; width: 20px; height: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);" class="animate-pulse"></div>`,
    className: 'user-location-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

// Component to handle map view changes
const MapController: React.FC<{ center: [number, number]; locations: MapLocation[]; userLocation: Location | null }> = ({ center, locations, userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    if (locations.length > 0 || userLocation) {
      const bounds = L.latLngBounds([]);
      
      // Add user location to bounds
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      
      // Add all locations to bounds
      locations.forEach(location => {
        bounds.extend([location.position.lat, location.position.lng]);
      });
      
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
      } else {
        map.setView(center, 10);
      }
    } else {
      map.setView(center, 10);
    }
  }, [map, center, locations, userLocation]);
  
  return null;
};

const OpenStreetMap: React.FC<OpenStreetMapProps> = ({ 
  className = "w-full", 
  height = "400px",
  locations = []
}) => {
  const [mounted, setMounted] = useState(false);
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [mapCenter, setMapCenter] = useState<Location>({ lat: 28.6139, lng: 77.2090 }); // New Delhi fallback
  const [locationStatus, setLocationStatus] = useState<'loading' | 'granted' | 'permission_denied' | 'position_unavailable' | 'timeout' | 'unavailable'>('loading');
  const [mapError, setMapError] = useState<string | null>(null);

  const requestLocation = () => {
    setLocationStatus('loading');
    
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        setUserLocation(location);
        setMapCenter(location);
        setLocationStatus('granted');
      },
      // Error callback
      (error) => {
        console.warn('Geolocation error:', error.message, 'Code:', error.code);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationStatus('permission_denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationStatus('position_unavailable');
            break;
          case error.TIMEOUT:
            setLocationStatus('timeout');
            break;
          default:
            setLocationStatus('position_unavailable');
        }
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache for 1 minute
      }
    );
  };

  useEffect(() => {
    setMounted(true);
    requestLocation();
  }, []);

  const getStatusMessage = () => {
    switch (locationStatus) {
      case 'loading':
        return 'Requesting location permission...';
      case 'granted':
        return 'Showing your current location';
      case 'permission_denied':
        return 'Location access denied. Showing New Delhi, India';
      case 'position_unavailable':
        return 'Location unavailable. Showing New Delhi, India';
      case 'timeout':
        return 'Location request timed out. Showing New Delhi, India';
      case 'unavailable':
        return 'Geolocation not supported. Showing New Delhi, India';
      default:
        return '';
    }
  };


  if (mapError) {
    return (
      <div className={className} style={{ height }}>
        <div className="h-full bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">{mapError}</p>
            <button 
              onClick={() => {
                setMapError(null);
                requestLocation();
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!mounted || locationStatus === 'loading') {
    return (
      <div className={className} style={{ height }}>
        <div className="h-full bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{getStatusMessage()}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className} relative`} style={{ height }}>
      <MapContainer
        center={[mapCenter.lat, mapCenter.lng]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{
            tileerror: () => {
              setMapError('Failed to load map tiles. Please check your internet connection.');
            },
            tileloadstart: () => {
              if (mapError) setMapError(null);
            }
          }}
        />
        
        <MapController center={[mapCenter.lat, mapCenter.lng]} locations={locations} userLocation={userLocation} />
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={createUserLocationIcon()}>
            <Popup>
              <div className="text-sm">
                <strong>Your Location</strong>
                <br />
                Current position
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Location markers */}
        {locations.map((location) => (
          <React.Fragment key={location.id}>
            <Marker 
              position={[location.position.lat, location.position.lng]} 
              icon={createCustomIcon(location.type, location.status)}
            >
              <Popup>
                <div className="text-sm">
                  <strong>{location.name}</strong>
                  <br />
                  Type: {location.type}
                  <br />
                  Status: <span className={
                    location.status === 'safe' ? 'text-green-600' :
                    location.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }>{location.status}</span>
                  {location.lastSeen && (
                    <>
                      <br />
                      Last seen: {location.lastSeen}
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
            
            {/* Geofence circles */}
            {location.type === 'geofence' && (
              <Circle
                center={[location.position.lat, location.position.lng]}
                radius={500} // 500 meter radius
                pathOptions={{
                  color: location.status === 'safe' ? '#22c55e' : location.status === 'warning' ? '#eab308' : '#ef4444',
                  fillColor: location.status === 'safe' ? '#22c55e' : location.status === 'warning' ? '#eab308' : '#ef4444',
                  fillOpacity: 0.1,
                  weight: 2
                }}
              />
            )}
          </React.Fragment>
        ))}
      </MapContainer>

      {/* Status indicator */}
      <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-lg z-[1000]">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            locationStatus === 'granted' ? 'bg-green-500 animate-pulse' :
            (locationStatus === 'permission_denied' || locationStatus === 'position_unavailable' || 
             locationStatus === 'timeout' || locationStatus === 'unavailable') ? 'bg-yellow-500' : 'bg-gray-400'
          }`} />
          <span className="text-foreground">{getStatusMessage()}</span>
        </div>
        {(locationStatus === 'permission_denied' || locationStatus === 'position_unavailable' || locationStatus === 'timeout' || locationStatus === 'unavailable') && (
          <button 
            onClick={requestLocation}
            className="mt-2 flex items-center gap-1 px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Retry Location
          </button>
        )}
      </div>

      {/* Legend */}
      {locations.length > 0 && (
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-lg z-[1000]">
          <div className="space-y-2">
            <div className="font-semibold text-foreground mb-2">Map Legend</div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-foreground">Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-foreground">Alert</span>
            </div>
          </div>
        </div>
      )}

      {/* Location info panel */}
      {locations.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm shadow-lg z-[1000] max-w-xs">
          <div className="space-y-2">
            <div className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Active Locations ({locations.length})
            </div>
            {locations.slice(0, 3).map((location) => (
              <div key={location.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {location.type === 'tourist' && <Users className="w-3 h-3 text-blue-500" />}
                  {location.type === 'incident' && <AlertTriangle className="w-3 h-3 text-red-500" />}
                  {location.type === 'geofence' && <Shield className="w-3 h-3 text-green-500" />}
                  <span className="text-foreground text-xs">{location.name}</span>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  location.status === 'safe' ? 'bg-green-500' :
                  location.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
              </div>
            ))}
            {locations.length > 3 && (
              <div className="text-xs text-muted-foreground">
                +{locations.length - 3} more locations
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OpenStreetMap;
