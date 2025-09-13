import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Settings, Package, Image, FileText, Calendar } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const { user, signOut, loading } = useAuth();
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

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Settings },
    { name: 'Artwork', href: '/admin/artwork', icon: Image },
    { name: 'Commission Packages', href: '/admin/packages', icon: Package },
    { name: 'Commission Requests', href: '/admin/requests', icon: FileText },
    { name: 'Consultation Bookings', href: '/admin/bookings', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r border-border min-h-screen">
          <div className="p-6">
            <h1 className="text-xl font-handwritten font-bold">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          
          <nav className="px-4 space-y-2">
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
          
          <div className="absolute bottom-4 left-4 right-4">
            <Button 
              onClick={signOut} 
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