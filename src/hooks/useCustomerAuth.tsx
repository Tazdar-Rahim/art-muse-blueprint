import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useCustomerAuth = () => {
  const { user, loading: authLoading } = useAuth();
  const [isCustomer, setIsCustomer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCustomerRole = async () => {
      if (!user) {
        setIsCustomer(false);
        setLoading(false);
        return;
      }

      try {
        // Check if user has admin role - if they do, they're not a regular customer
        const { data: adminData, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .single();
        
        // If user has no admin role, they are a customer
        setIsCustomer(!adminData);
      } catch (error) {
        console.error('Error checking user role:', error);
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