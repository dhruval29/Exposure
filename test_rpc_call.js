// Test RPC call from frontend
// Run this in your browser console while logged in

import { supabase } from './src/lib/supabaseClient.js'

async function testIsAdminRPC() {
  try {
    console.log('Testing is_admin RPC call...')
    
    // Get current user
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError) {
      console.error('Error getting user:', userError)
      return
    }
    
    console.log('Current user ID:', userData.user.id)
    
    // Test the RPC call
    const { data, error } = await supabase.rpc('is_admin', { uid: userData.user.id })
    
    if (error) {
      console.error('RPC Error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
    } else {
      console.log('RPC Success:', data)
      console.log('Is admin:', Boolean(data))
    }
    
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}

// Run the test
testIsAdminRPC()
