import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Image, Package, FileText, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    artworkCount: 0,
    packageCount: 0,
    requestCount: 0,
    bookingCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [artwork, packages, requests, bookings] = await Promise.all([
        supabase.from('artwork').select('*', { count: 'exact' }),
        supabase.from('commission_packages').select('*', { count: 'exact' }),
        supabase.from('commission_requests').select('*', { count: 'exact' }),
        supabase.from('consultation_bookings').select('*', { count: 'exact' }),
      ]);

      setStats({
        artworkCount: artwork.count || 0,
        packageCount: packages.count || 0,
        requestCount: requests.count || 0,
        bookingCount: bookings.count || 0,
      });
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Artwork',
      count: stats.artworkCount,
      description: 'Total artwork pieces',
      icon: Image,
    },
    {
      title: 'Commission Packages',
      count: stats.packageCount,
      description: 'Available packages',
      icon: Package,
    },
    {
      title: 'Commission Requests',
      count: stats.requestCount,
      description: 'Pending requests',
      icon: FileText,
    },
    {
      title: 'Consultation Bookings',
      count: stats.bookingCount,
      description: 'Total bookings',
      icon: Calendar,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-handwritten font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the admin panel</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.count}</div>
                <p className="text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Image className="w-6 h-6" />
                <div>
                  <h3 className="font-medium">Add New Artwork</h3>
                  <p className="text-sm text-muted-foreground">Upload and manage artwork</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <Package className="w-6 h-6" />
                <div>
                  <h3 className="font-medium">Create Package</h3>
                  <p className="text-sm text-muted-foreground">Add commission packages</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6" />
                <div>
                  <h3 className="font-medium">Review Requests</h3>
                  <p className="text-sm text-muted-foreground">Manage commission requests</p>
                </div>
              </div>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;