import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// TEMPORARY COMPONENT - Remove after setting up admin user
export const AdminSetup = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const createAdminUser = async () => {
    if (!user) {
      toast({
        title: "Error", 
        description: "You must be logged in to create an admin user",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .insert([{ user_id: user.id, role: 'admin' }])
        .select();

      if (error) {
        toast({
          title: "Error", 
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Success", 
        description: "Admin role assigned successfully! You can now access admin features.",
      });
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to create admin user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Card className="max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>Please log in first to set up admin access</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Admin Setup</CardTitle>
        <CardDescription>
          Grant admin access to your account ({user.email})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={createAdminUser} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Admin User...' : 'Make Me Admin'}
        </Button>
        <p className="text-sm text-muted-foreground mt-4">
          ⚠️ Remove this component after setting up your admin user for security.
        </p>
      </CardContent>
    </Card>
  );
};