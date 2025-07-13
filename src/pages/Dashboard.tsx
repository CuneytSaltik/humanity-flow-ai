import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, Calendar, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalUsers: number;
  totalClients: number;
  totalAppointments: number;
  recentActivities: any[];
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClients: 0,
    totalAppointments: 0,
    recentActivities: []
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [usersResult, clientsResult, appointmentsResult, activitiesResult] = await Promise.all([
          supabase.from('users').select('*', { count: 'exact' }),
          supabase.from('clients').select('*', { count: 'exact' }),
          supabase.from('appointments').select('*', { count: 'exact' }),
          supabase
            .from('activity_logs')
            .select('*, users(full_name)')
            .order('created_at', { ascending: false })
            .limit(10)
        ]);

        setStats({
          totalUsers: usersResult.count || 0,
          totalClients: clientsResult.count || 0,
          totalAppointments: appointmentsResult.count || 0,
          recentActivities: activitiesResult.data || []
        });
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };

    loadDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, description }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground">
          Welcome back, {userProfile?.full_name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.totalUsers')}
          value={stats.totalUsers}
          icon={Users}
          description="Active users in system"
        />
        <StatCard
          title={t('dashboard.totalClients')}
          value={stats.totalClients}
          icon={UserCheck}
          description="Total registered clients"
        />
        <StatCard
          title={t('dashboard.totalAppointments')}
          value={stats.totalAppointments}
          icon={Calendar}
          description="Total appointments"
        />
        <StatCard
          title="Recent Activities"
          value={stats.recentActivities.length}
          icon={Activity}
          description="Latest system activities"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
            <CardDescription>Latest activities in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {activity.users?.full_name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.action_type} - {activity.details}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {userProfile?.role === 'admin' && (
                <>
                  <div className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                    Add New User
                  </div>
                  <div className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                    View User Management
                  </div>
                </>
              )}
              <div className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                Add New Client
              </div>
              <div className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                Schedule Appointment
              </div>
              <div className="p-2 rounded border hover:bg-muted/50 cursor-pointer">
                Upload Document
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;