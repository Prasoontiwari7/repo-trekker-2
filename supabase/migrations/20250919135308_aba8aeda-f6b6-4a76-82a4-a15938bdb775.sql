-- Create enum types
CREATE TYPE public.user_role AS ENUM ('tourist', 'admin', 'police', 'team-leader');
CREATE TYPE public.incident_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE public.incident_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.zone_type AS ENUM ('safe', 'warning', 'restricted', 'emergency');
CREATE TYPE public.event_type AS ENUM ('entry', 'exit', 'violation');
CREATE TYPE public.support_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'tourist',
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create digital_ids table
CREATE TABLE public.digital_ids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    kyc_hash TEXT NOT NULL,
    record_hash TEXT NOT NULL,
    tx_hash TEXT, -- blockchain transaction hash
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT now(),
    valid_to TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create locations table
CREATE TABLE public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    accuracy FLOAT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(11, 8) NOT NULL,
    level incident_level NOT NULL DEFAULT 'medium',
    status incident_status NOT NULL DEFAULT 'open',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create geofences table
CREATE TABLE public.geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    polygon_geojson JSONB NOT NULL,
    zone_type zone_type NOT NULL DEFAULT 'safe',
    created_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create geofence_events table
CREATE TABLE public.geofence_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    geofence_id UUID REFERENCES public.geofences(id) ON DELETE CASCADE,
    event_type event_type NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create anomalies table
CREATE TABLE public.anomalies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tourist_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    score FLOAT NOT NULL,
    flags JSONB,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    resolved BOOLEAN DEFAULT false
);

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    place_id TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create global_chat table
CREATE TABLE public.global_chat (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    country_tag TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create support_messages table
CREATE TABLE public.support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    status support_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create team table
CREATE TABLE public.team (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_ids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.geofence_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomalies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.global_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users FOR SELECT USING (auth.uid() = auth_user_id);
CREATE POLICY "Users can update their own data" ON public.users FOR UPDATE USING (auth.uid() = auth_user_id);
CREATE POLICY "Admin and police can view all users" ON public.users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'police'))
);

-- Digital IDs policies
CREATE POLICY "Users can view their own digital ID" ON public.digital_ids FOR SELECT USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Users can create their own digital ID" ON public.digital_ids FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Locations policies
CREATE POLICY "Users can manage their own locations" ON public.locations FOR ALL USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin and police can view all locations" ON public.locations FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'police'))
);

-- Incidents policies
CREATE POLICY "Users can view and create incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Users can create incidents" ON public.incidents FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin and police can manage incidents" ON public.incidents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'police'))
);

-- Geofences policies
CREATE POLICY "Everyone can view geofences" ON public.geofences FOR SELECT USING (true);
CREATE POLICY "Admin can manage geofences" ON public.geofences FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Geofence events policies
CREATE POLICY "Users can view their own geofence events" ON public.geofence_events FOR SELECT USING (
    tourist_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "System can create geofence events" ON public.geofence_events FOR INSERT WITH CHECK (true);

-- Anomalies policies
CREATE POLICY "Users can view their own anomalies" ON public.anomalies FOR SELECT USING (
    tourist_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin and police can view all anomalies" ON public.anomalies FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role IN ('admin', 'police'))
);

-- Reviews policies
CREATE POLICY "Everyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Users can update their own reviews" ON public.reviews FOR UPDATE USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Global chat policies
CREATE POLICY "Everyone can view global chat" ON public.global_chat FOR SELECT USING (true);
CREATE POLICY "Authenticated users can post to global chat" ON public.global_chat FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);

-- Support messages policies
CREATE POLICY "Users can view their own support messages" ON public.support_messages FOR SELECT USING (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Users can create support messages" ON public.support_messages FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM public.users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admin can view all support messages" ON public.support_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role = 'admin')
);

-- Team policies
CREATE POLICY "Everyone can view team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Team leaders can manage team" ON public.team FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE auth_user_id = auth.uid() AND role = 'team-leader')
);

-- Create indexes for performance
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_digital_ids_user_id ON public.digital_ids(user_id);
CREATE INDEX idx_locations_user_id ON public.locations(user_id);
CREATE INDEX idx_locations_timestamp ON public.locations(timestamp);
CREATE INDEX idx_incidents_user_id ON public.incidents(user_id);
CREATE INDEX idx_incidents_status ON public.incidents(status);
CREATE INDEX idx_geofence_events_tourist_id ON public.geofence_events(tourist_id);
CREATE INDEX idx_anomalies_tourist_id ON public.anomalies(tourist_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_reviews_place_id ON public.reviews(place_id);
CREATE INDEX idx_global_chat_created_at ON public.global_chat(created_at);
CREATE INDEX idx_support_messages_status ON public.support_messages(status);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.locations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.global_chat;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
ALTER PUBLICATION supabase_realtime ADD TABLE public.geofence_events;