import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Package, Image, FileText, Calendar, ShoppingBag, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { supabase } from '@/integrations/supabase/client';

const AdminLayout = () => {
  const { user, isAdmin, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have administrator privileges to access this area.
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Settings },
    { name: 'Artwork', href: '/admin/artwork', icon: Image },
    { name: 'Commission Packages', href: '/admin/packages', icon: Package },
    { name: 'Commission Requests', href: '/admin/requests', icon: FileText },
    { name: 'Consultation Bookings', href: '/admin/bookings', icon: Calendar },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { name: 'Email Management', href: '/admin/emails', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
          <div className="p-6">
            <h1 className="text-xl font-handwritten font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          
          <nav className="px-4 space-y-2 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 mt-auto">
            <Button 
              onClick={handleSignOut} 
              variant="outline" 
              className="w-full flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;