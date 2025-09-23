import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface MapLocation {
  id: string;
  name: string;
  position: { lat: number; lng: number };
  status: 'safe' | 'warning' | 'alert';
  type: 'tourist' | 'incident' | 'geofence';
}

export const GoogleMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Mock locations for demonstration
  const locations: MapLocation[] = [
    {
      id: '1',
      name: 'John Smith',
      position: { lat: 28.6139, lng: 77.2090 }, // New Delhi
      status: 'safe',
      type: 'tourist'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      position: { lat: 19.0760, lng: 72.8777 }, // Mumbai
      status: 'warning',
      type: 'tourist'
    },
    {
      id: '3',
      name: 'Security Incident',
      position: { lat: 26.9124, lng: 75.7873 }, // Jaipur
      status: 'alert',
      type: 'incident'
    },
    {
      id: '4',
      name: 'Safe Zone',
      position: { lat: 15.2993, lng: 74.1240 }, // Goa
      status: 'safe',
      type: 'geofence'
    }
  ];

  useEffect(() => {
    // Load Google Maps API
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      // Get API key from Supabase secrets
      const getApiKey = async () => {
        try {
          const { data, error } = await supabase.functions.invoke('get-maps-key');
          if (error) throw error;
          return data.apiKey;
        } catch (error) {
          console.error('Failed to get API key:', error);
          // Fallback to a public demo key or show error
          return 'AIzaSyBNLrJhOMz6idD-Q-xHBn8G8D_m-wEQdx8'; // This is a demo key
        }
      };

      getApiKey().then((apiKey) => {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => setIsLoaded(true);
        script.onerror = () => console.error('Failed to load Google Maps API');
        document.head.appendChild(script);
      });
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      const newMap = new google.maps.Map(mapRef.current, {
        center: { lat: 20.5937, lng: 78.9629 }, // India center
        zoom: 5,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [{ color: '#1a1a1a' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
          },
          {
            featureType: 'all',
            elementType: 'labels.text.stroke',
            stylers: [{ color: '#000000' }, { lightness: 13 }]
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.fill',
            stylers: [{ color: '#000000' }]
          },
          {
            featureType: 'administrative',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#144b53' }, { lightness: 14 }, { weight: 1.4 }]
          },
          {
            featureType: 'landscape',
            elementType: 'all',
            stylers: [{ color: '#08304b' }]
          },
          {
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [{ color: '#0c4152' }, { lightness: 5 }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [{ color: '#000000' }]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#0b434f' }, { lightness: 25 }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry.fill',
            stylers: [{ color: '#000000' }]
          },
          {
            featureType: 'road.arterial',
            elementType: 'geometry.stroke',
            stylers: [{ color: '#0b3d51' }, { lightness: 16 }]
          },
          {
            featureType: 'road.local',
            elementType: 'geometry',
            stylers: [{ color: '#000000' }]
          },
          {
            featureType: 'transit',
            elementType: 'all',
            stylers: [{ color: '#146474' }]
          },
          {
            featureType: 'water',
            elementType: 'all',
            stylers: [{ color: '#021019' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true
      });

      setMap(newMap);

      // Add markers for each location
      locations.forEach((location) => {
        const getMarkerIcon = (type: string, status: string) => {
          let color = '#4ECDC4'; // default safe color
          if (status === 'warning') color = '#FFA500';
          if (status === 'alert') color = '#FF4444';
          
          let symbol = '●';
          if (type === 'incident') symbol = '⚠';
          if (type === 'geofence') symbol = '🛡';
          if (type === 'tourist') symbol = '👤';

          return {
            url: `data:image/svg+xml,${encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="10" fill="${color}" stroke="#ffffff" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="#ffffff" font-size="12" font-weight="bold">${symbol}</text>
              </svg>
            `)}`,
            scaledSize: new google.maps.Size(24, 24),
            anchor: new google.maps.Point(12, 12)
          };
        };

        const marker = new google.maps.Marker({
          position: location.position,
          map: newMap,
          title: location.name,
          icon: getMarkerIcon(location.type, location.status)
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: black; padding: 8px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${location.name}</h3>
              <p style="margin: 0; font-size: 12px;">Status: <span style="color: ${location.status === 'safe' ? '#4ECDC4' : location.status === 'warning' ? '#FFA500' : '#FF4444'}; font-weight: bold;">${location.status.toUpperCase()}</span></p>
              <p style="margin: 4px 0 0 0; font-size: 12px;">Type: ${location.type}</p>
            </div>
          `
        });

        marker.addListener('click', () => {
          infoWindow.open(newMap, marker);
        });
      });
    }
  }, [isLoaded, map]);

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Real-Time Location Tracking
          </CardTitle>
          <CardDescription>
            Live map showing tourist locations and incidents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading map...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Real-Time Location Tracking
        </CardTitle>
        <CardDescription>
          Live map showing tourist locations and incidents
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Safe</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Alert</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-3 h-3" />
              <span>Tourists</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-3 h-3" />
              <span>Safe Zones</span>
            </div>
          </div>
          
          {/* Map Container */}
          <div 
            ref={mapRef} 
            className="h-96 w-full rounded-lg border border-border overflow-hidden"
          />
        </div>
      </CardContent>
    </Card>
  );
};