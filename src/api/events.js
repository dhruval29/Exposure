export const runtime = 'edge';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        created_at,
        cover_image:images(
          id,
          public_url,
          title
        )
      `)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      return new Response(JSON.stringify({ events: [], error: error.message }), { 
        status: 500, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ events: events || [] }), { 
      status: 200, 
      headers: { 'content-type': 'application/json' } 
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ events: [], error: 'Internal server error' }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' } 
    });
  }
}

export async function POST(request) {
  try {
    const { title, description, start_date, end_date, cover_image_id } = await request.json();

    if (!title || !start_date) {
      return new Response(JSON.stringify({ error: 'Title and start_date are required' }), { 
        status: 400, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        start_date,
        end_date,
        cover_image_id
      })
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        created_at,
        cover_image:images(
          id,
          public_url,
          title
        )
      `)
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ event }), { 
      status: 201, 
      headers: { 'content-type': 'application/json' } 
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' } 
    });
  }
}

export async function PUT(request) {
  try {
    const { id, title, description, start_date, end_date, cover_image_id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: 'Event ID is required' }), { 
        status: 400, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    const { data: event, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        start_date,
        end_date,
        cover_image_id
      })
      .eq('id', id)
      .select(`
        id,
        title,
        description,
        start_date,
        end_date,
        created_at,
        cover_image:images(
          id,
          public_url,
          title
        )
      `)
      .single();

    if (error) {
      console.error('Error updating event:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ event }), { 
      status: 200, 
      headers: { 'content-type': 'application/json' } 
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' } 
    });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return new Response(JSON.stringify({ error: 'Event ID is required' }), { 
        status: 400, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting event:', error);
      return new Response(JSON.stringify({ error: error.message }), { 
        status: 500, 
        headers: { 'content-type': 'application/json' } 
      });
    }

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'content-type': 'application/json' } 
    });
  } catch (e) {
    console.error('Unexpected error:', e);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { 
      status: 500, 
      headers: { 'content-type': 'application/json' } 
    });
  }
}
