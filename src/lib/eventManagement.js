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

    if (error) throw error;
    return { data, error: null };
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
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        cover_image_id: eventData.cover_image_id
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

    if (error) throw error;
    return { data, error: null };
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
        start_date: eventData.start_date,
        end_date: eventData.end_date,
        cover_image_id: eventData.cover_image_id
      })
      .eq('id', eventId)
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

    if (error) throw error;
    return { data, error: null };
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

// Format date for input fields
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

// Format date for display
export const formatDateForDisplay = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
