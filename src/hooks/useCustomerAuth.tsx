import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [isCustomer, setIsCustomer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCustomerRole = async () => {
      console.log('checkCustomerRole called:', { user: !!user, userId: user?.id, authLoading });
      
      if (!user) {
        console.log('No user, setting isCustomer to false');
        setIsCustomer(false);
        setLoading(false);
        return;
      }

      try {
        console.log('Checking admin role for user:', user.id);
        // Check if user has admin role - if they do, they're not a regular customer
        const { data: adminData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();

        console.log('Admin check result:', { adminData, error: error?.code });
        
        // If user has no admin role, they are a customer
        setIsCustomer(!adminData);
        console.log('Setting isCustomer to:', !adminData);
      } catch (error) {
        console.log('Error checking admin role, treating as customer:', error);
        // If there's an error or no role found, treat as customer
        setIsCustomer(true);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkCustomerRole();
    }
  }, [user, authLoading]);

  return {
    isCustomer,
    loading: loading || authLoading,
    user
  };
};