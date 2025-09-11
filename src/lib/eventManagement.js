import { supabase } from './supabaseClient';

// Fetch all events
export const fetchEvents = async () => {
  try {
    const { data, error } = await supabase
      .from('events')
      .select(`
        id,
        title,
        description,
        month_year,
        created_at,
        cover_image_id
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Fetch cover images separately to avoid relationship conflicts
    const eventsWithImages = await Promise.all(
      (data || []).map(async (event) => {
        if (event.cover_image_id) {
          const { data: image } = await supabase
            .from('images')
            .select('id, public_url, title')
            .eq('id', event.cover_image_id)
            .single();
          return { ...event, cover_image: image };
        }
        return { ...event, cover_image: null };
      })
    );
    
    return { data: eventsWithImages, error: null };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { data: null, error };
  }
};

// Create a new event
export const createEvent = async (eventData) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .insert({
        title: eventData.title,
        description: eventData.description,
        month_year: eventData.month_year,
        cover_image_id: eventData.cover_image_id
      })
      .select(`
        id,
        title,
        description,
        month_year,
        created_at,
        cover_image_id
      `)
      .single();

    if (error) throw error;
    
    // Fetch cover image separately if needed
    let eventWithImage = { ...data, cover_image: null };
    if (data.cover_image_id) {
      const { data: image } = await supabase
        .from('images')
        .select('id, public_url, title')
        .eq('id', data.cover_image_id)
        .single();
      eventWithImage.cover_image = image;
    }
    
    return { data: eventWithImage, error: null };
  } catch (error) {
    console.error('Error creating event:', error);
    return { data: null, error };
  }
};

// Update an existing event
export const updateEvent = async (eventId, eventData) => {
  try {
    const { data, error } = await supabase
      .from('events')
      .update({
        title: eventData.title,
        description: eventData.description,
        month_year: eventData.month_year,
        cover_image_id: eventData.cover_image_id
      })
      .eq('id', eventId)
      .select(`
        id,
        title,
        description,
        month_year,
        created_at,
        cover_image_id
      `)
      .single();

    if (error) throw error;
    
    // Fetch cover image separately if needed
    let eventWithImage = { ...data, cover_image: null };
    if (data.cover_image_id) {
      const { data: image } = await supabase
        .from('images')
        .select('id, public_url, title')
        .eq('id', data.cover_image_id)
        .single();
      eventWithImage.cover_image = image;
    }
    
    return { data: eventWithImage, error: null };
  } catch (error) {
    console.error('Error updating event:', error);
    return { data: null, error };
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Error deleting event:', error);
    return { error };
  }
};

// Fetch available images for event cover selection
export const fetchAvailableImages = async () => {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('id, public_url, title')
      .eq('is_public', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching images:', error);
    return { data: null, error };
  }
};

// Date formatting functions removed - using month_year format instead
// Example: "Dec 24", "Jan 25", etc.
