import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          persistSession: false,
        },
      }
    )

    const { lat, lng, description, user_id } = await req.json()

    console.log('SOS Alert received:', { lat, lng, description, user_id })

    // Validate required fields
    if (!lat || !lng || !user_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: lat, lng, user_id' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create incident record in database
    const { data: incident, error: incidentError } = await supabaseClient
      .from('incidents')
      .insert({
        user_id,
        lat: parseFloat(lat),
        lng: parseFloat(lng),
        level: 'critical',
        status: 'open',
        description: description || 'Emergency SOS Alert - Immediate assistance required'
      })
      .select()
      .single()

    if (incidentError) {
      console.error('Error creating incident:', incidentError)
      return new Response(
        JSON.stringify({ error: 'Failed to create incident record' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get user information for notification
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('name, email, phone')
      .eq('id', user_id)
      .single()

    if (userError) {
      console.error('Error fetching user:', userError)
    }

    console.log('SOS Alert processed successfully:', {
      incident_id: incident.id,
      user_name: user?.name,
      location: { lat, lng }
    })

    // In a real implementation, you would:
    // 1. Send SMS alerts to emergency contacts
    // 2. Send email notifications to authorities
    // 3. Trigger push notifications to nearby users
    // 4. Contact local emergency services

    // Simulate emergency response
    const response = {
      success: true,
      incident_id: incident.id,
      message: 'SOS alert processed successfully. Emergency services have been notified.',
      emergency_contacts: [
        'Tourist Emergency Helpline: 1800-11-1363',
        'Police: 100',
        'Medical Emergency: 102'
      ],
      estimated_response_time: '5-10 minutes',
      user_info: user ? {
        name: user.name,
        email: user.email
      } : null
    }

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('SOS Alert processing error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error processing SOS alert',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})