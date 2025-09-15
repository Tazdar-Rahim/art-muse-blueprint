// Script to create the first admin user
// Run this in the browser console or create a temporary component to execute it

import { supabase } from '@/integrations/supabase/client';

export const createAdminUser = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([
        { user_id: userId, role: 'admin' }
      ])
      .select();

    if (error) {
      console.error('Error creating admin user:', error);
      return { success: false, error: error.message };
    }

    console.log('Admin user created successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error creating admin user:', error);
    return { success: false, error: error.message };
  }
};

// To use this script:
// 1. Log in to your application first
// 2. Open browser console
// 3. Get your user ID from: (await supabase.auth.getUser()).data.user?.id
// 4. Run: createAdminUser('your-user-id-here')