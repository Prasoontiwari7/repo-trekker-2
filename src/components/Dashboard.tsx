import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  MapPin, 
  AlertTriangle, 
  Users, 
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Navigation,
  Phone,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import OpenStreetMap from '@/components/OpenStreetMap';

interface DashboardStats {
  activeTourists: number;
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  geofences: number;
}

interface Incident {
  id: string;
  level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  timestamp: string;
  status: 'open' | 'in_progress' | 'resolved';
}

interface Tourist {
  id: string;
  name: string;
  location: string;
  status: 'safe' | 'warning' | 'alert';
  lastSeen: string;
}

export const Dashboard: React.FC = () => {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    activeTourists: 0,
    totalIncidents: 0,
    openIncidents: 0,
    resolvedIncidents: 0,
    geofences: 0
  });
  const [recentIncidents, setRecentIncidents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch dashboard statistics
      const [
        { count: touristCount },
        { count: totalIncidentCount },
        { count: geofenceCount },
        { data: incidents }
      ] = await Promise.all([
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('incidents').select('*', { count: 'exact', head: true }),
        supabase.from('geofences').select('*', { count: 'exact', head: true }),
        supabase.from('incidents').select('*, users(name)').order('created_at', { ascending: false }).limit(5)
      ]);

      // Count open and resolved incidents
      const { count: openCount } = await supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'open');

      const { count: resolvedCount } = await supabase
        .from('incidents')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'resolved');

      setDashboardStats({
        activeTourists: touristCount || 0,
        totalIncidents: totalIncidentCount || 0,
        openIncidents: openCount || 0,
        resolvedIncidents: resolvedCount || 0,
        geofences: geofenceCount || 0
      });

      setRecentIncidents(incidents || []);
    } catch (error: any) {
      toast({
        title: "Error loading dashboard",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Map location data for OpenStreetMap
  const mapLocations = [
    {
      id: '1',
      name: 'John Smith',
      position: { lat: 28.6139, lng: 77.2090 }, // New Delhi
      status: 'safe' as const,
      type: 'tourist' as const,
      lastSeen: '2 minutes ago'
    },
    {
      id: '2', 
      name: 'Sarah Johnson',
      position: { lat: 19.0760, lng: 72.8777 }, // Mumbai
      status: 'warning' as const,
      type: 'tourist' as const,
      lastSeen: '15 minutes ago'
    },
    {
      id: '3',
      name: 'Security Incident',
      position: { lat: 26.9124, lng: 75.7873 }, // Jaipur
      status: 'alert' as const,
      type: 'incident' as const,
      lastSeen: '1 hour ago'
    },
    {
      id: '4',
      name: 'Safe Zone - Goa',
      position: { lat: 15.2993, lng: 74.1240 }, // Goa
      status: 'safe' as const,
      type: 'geofence' as const,
      lastSeen: 'Active'
    },
    {
      id: '5',
      name: 'Mike Chen',
      position: { lat: 15.2993, lng: 74.1240 }, // Goa
      status: 'safe' as const,
      type: 'tourist' as const,
      lastSeen: '5 minutes ago'
    },
    {
      id: '6',
      name: 'Emma Wilson',
      position: { lat: 26.9124, lng: 75.7873 }, // Jaipur  
      status: 'alert' as const,
      type: 'tourist' as const,
      lastSeen: '1 hour ago'
    }
  ];

  // Mock data for demonstration
  const mockTourists: Tourist[] = [
    {
      id: '1',
      name: 'John Smith',
      location: 'New Delhi, India',
      status: 'safe',
      lastSeen: '2 minutes ago'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      location: 'Mumbai, India',
      status: 'warning',
      lastSeen: '15 minutes ago'
    },
    {
      id: '3',
      name: 'Mike Chen',
      location: 'Goa, India',
      status: 'safe',
      lastSeen: '5 minutes ago'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      location: 'Jaipur, India',
      status: 'alert',
      lastSeen: '1 hour ago'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe':
        return <Badge variant="default" className="bg-success text-success-foreground">Safe</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Warning</Badge>;
      case 'alert':
        return <Badge variant="destructive">Alert</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getIncidentLevelBadge = (level: string) => {
    switch (level) {
      case 'low':
        return <Badge variant="outline">Low</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium</Badge>;
      case 'high':
        return <Badge variant="destructive" className="bg-warning">High</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Security Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Real-time monitoring and incident management
              </p>
            </div>
            <Button onClick={fetchDashboardData} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Active Tourists
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dashboardStats.activeTourists}</div>
              <p className="text-xs text-success">All monitored</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Total Incidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dashboardStats.totalIncidents}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardStats.openIncidents} open, {dashboardStats.resolvedIncidents} resolved
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Geofences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{dashboardStats.geofences}</div>
              <p className="text-xs text-success">Active zones</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-card to-card/50 border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">Online</div>
              <p className="text-xs text-success">All systems operational</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="incidents" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="incidents">Recent Incidents</TabsTrigger>
              <TabsTrigger value="tourists">Tourist Monitoring</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="incidents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Recent Incidents
                  </CardTitle>
                  <CardDescription>
                    Latest security incidents and alerts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentIncidents.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
                        <p>No recent incidents</p>
                        <p className="text-sm">All tourists are safe</p>
                      </div>
                    ) : (
                      recentIncidents.map((incident) => (
                        <div key={incident.id} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card/50">
                          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {getIncidentLevelBadge(incident.level)}
                              <Badge variant="outline">{incident.status}</Badge>
                            </div>
                            <h4 className="font-medium text-foreground">{incident.description}</h4>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {incident.lat}, {incident.lng}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(incident.created_at).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tourists" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Tourist Monitoring
                  </CardTitle>
                  <CardDescription>
                    Real-time tourist location and status tracking
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTourists.map((tourist) => (
                      <div key={tourist.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                            {tourist.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground">{tourist.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {tourist.location}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(tourist.status)}
                          <p className="text-xs text-muted-foreground mt-1">
                            Last seen: {tourist.lastSeen}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* OpenStreetMap Section */}
              <div className="bg-card rounded-xl border border-border shadow-md p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-foreground flex items-center gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Real-Time Location Tracking
                  </h2>
                  <p className="text-muted-foreground">
                    Interactive map showing live tourist locations, incidents, and safe zones with geolocation support.
                  </p>
                </div>
                
                <OpenStreetMap 
                  locations={mapLocations}
                  height="400px"
                  className="w-full"
                />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Safety Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Average Response Time</span>
                        <span className="font-semibold text-success">2.3 minutes</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Resolution Rate</span>
                        <span className="font-semibold text-success">98.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Tourist Satisfaction</span>
                        <span className="font-semibold text-success">4.8/5</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      System Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Server Uptime</span>
                        <span className="font-semibold text-success">99.9%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">API Response Time</span>
                        <span className="font-semibold text-success">120ms</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Active Connections</span>
                        <span className="font-semibold">{dashboardStats.activeTourists}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;